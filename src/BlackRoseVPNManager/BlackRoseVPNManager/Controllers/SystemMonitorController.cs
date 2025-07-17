using BlackRoseVPNManager.Models.NetworkMonitor;
using BlackRoseVPNManager.Services.NetworkMonitor;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace BlackRoseVPNManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemMonitorController : ControllerBase
{
    private readonly NetworkMonitorService _networkMonitorService;

    public SystemMonitorController(NetworkMonitorService networkMonitorService)
    {
        _networkMonitorService = networkMonitorService;
    }

    [HttpGet("network-usage-report/{type}")]
    public async Task<IActionResult> GetNetworkUsageReport(EnumNetworkUsageReportType type)
    {
        var report = await _networkMonitorService.GetNetworkReportAsync(type);
        return Ok(report);
    }
    [HttpGet("get-disk-space")]
    public async Task<IActionResult> GetDiskSpace()
    {
        try
        {
            var drive = DriveInfo.GetDrives()
                .Where(d => d.IsReady)
                .Select(d => new
                {
                    TotalSpaceGB = Math.Round(d.TotalSize / (1024.0 * 1024.0 * 1024.0), 2),
                    FreeSpaceGB = Math.Round(d.AvailableFreeSpace / (1024.0 * 1024.0 * 1024.0), 2),
                    UsedSpaceGB = Math.Round((d.TotalSize - d.AvailableFreeSpace) / (1024.0 * 1024.0 * 1024.0), 2)
                }).FirstOrDefault();

            return Ok(drive);
        }
        catch (Exception ex)
        {
            return Ok(new
            {
                Drives = Array.Empty<object>(),
                Error = "خطا در دریافت اطلاعات دیسک: " + ex.Message
            });
        }
    }
}
