using Microsoft.AspNetCore.SignalR;
using System.ComponentModel;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace BlackRoseVPNManager.Hubs;

public class SystemMonitorHub : Hub
{
    public async Task SendSystemUsage()
    {
        var totalRam = GetTotalPhysicalMemory();
        while (true)
        {
            var cpuUsage = await GetCpuUsage();
            var availableRam = await GetUsedMemory();

            await Clients.All.SendAsync("ReceiveSystemUsage", new
            {
                CpuUsage = cpuUsage,
                RamUsage = totalRam - availableRam,
                TotalRam = totalRam
            });

            await Task.Delay(2000);
        }
    }

    private async Task<float> GetCpuUsage()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            cpuCounter.NextValue(); // اولین مقدار ممکن است نادرست باشد
            await Task.Delay(1000); // منتظر 1 ثانیه برای دریافت مقدار دقیق
            return cpuCounter.NextValue();
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            var (prevIdle, prevTotal) = ReadCpuStats();
            await Task.Delay(1000);
            var (currIdle, currTotal) = ReadCpuStats();

            var idleDelta = currIdle - prevIdle;
            var totalDelta = currTotal - prevTotal;
            if (totalDelta == 0) return 0;

            var usage = (1 - (float)idleDelta / totalDelta) * 100;
            return Math.Max(0, Math.Min(100, usage));
        }

        return 0;
    }

    private (long idle, long total) ReadCpuStats()
    {
        try
        {
            var lines = File.ReadAllLines("/proc/stat");
            var cpuLine = lines.FirstOrDefault(l => l.StartsWith("cpu "));
            if (cpuLine == null) return (0, 0);

            var values = cpuLine.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                               .Skip(1)
                               .Select(long.Parse)
                               .ToArray();

            var idle = values[3] + values[4]; // idle + iowait
            var total = values.Sum();

            return (idle, total);
        }
        catch
        {
            return (0, 0);
        }
    }

    private async Task<float> GetUsedMemory()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var ramCounter = new PerformanceCounter("Memory", "Available MBytes");
            return ramCounter.NextValue();
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            try
            {
                var lines = File.ReadAllLines("/proc/meminfo");
                var availableLine = lines.FirstOrDefault(l => l.StartsWith("MemAvailable:"));
                if (availableLine != null)
                {
                    var value = long.Parse(availableLine.Split(' ', StringSplitOptions.RemoveEmptyEntries)[1]);
                    return value / 1024; // تبدیل به مگابایت
                }
            }
            catch
            {
            }
            return 0;
        }

        return 0;
    }

    private long GetTotalPhysicalMemory()
    {
        try
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                using var searcher = new System.Management.ManagementObjectSearcher("SELECT TotalVisibleMemorySize FROM Win32_OperatingSystem");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    long totalMemoryKb = Convert.ToInt64(obj["TotalVisibleMemorySize"]);
                    return totalMemoryKb / 1024; // تبدیل به مگابایت
                }
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                var lines = File.ReadAllLines("/proc/meminfo");
                var totalLine = lines.FirstOrDefault(l => l.StartsWith("MemTotal:"));
                if (totalLine != null)
                {
                    var value = long.Parse(totalLine.Split(' ', StringSplitOptions.RemoveEmptyEntries)[1]);
                    return value / 1024; // تبدیل به مگابایت
                }
            }
            return 0;
        }
        catch
        {
            return 0;
        }
    }
}