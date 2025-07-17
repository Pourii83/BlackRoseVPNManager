using BlackRoseVPNManager.Data;
using BlackRoseVPNManager.Models.NetworkMonitor;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;


namespace BlackRoseVPNManager.Services.NetworkMonitor;

public class NetworkMonitorService : BackgroundService
{
    private readonly ILogger<NetworkMonitorService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public NetworkMonitorService(ILogger<NetworkMonitorService> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<BlackRoseDbContext>();

                    var interfaces = NetworkInterface.GetAllNetworkInterfaces()
                        .Where(ni => ni.OperationalStatus == OperationalStatus.Up && ni.NetworkInterfaceType != NetworkInterfaceType.Loopback);

                    foreach (var ni in interfaces)
                    {
                        var stats = ni.GetIPv4Statistics();
                        var record = new NetworkUsage
                        {
                            InterfaceName = ni.Name,
                            BytesSent = stats.BytesSent,
                            BytesReceived = stats.BytesReceived,
                            Timestamp = DateTime.UtcNow
                        };

                        dbContext.NetworkUsages.Add(record);
                    }

                    await dbContext.SaveChangesAsync(stoppingToken);
                }

                _logger.LogInformation("Network usage recorded at {time}", DateTime.UtcNow);
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while monitoring network");
            }
        }
    }

    public async Task<NetworkReport> GetNetworkReportAsync(EnumNetworkUsageReportType reportType)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<BlackRoseDbContext>();

            var now = DateTime.UtcNow;
            DateTime startTime;

            switch (reportType)
            {
                case EnumNetworkUsageReportType.Daily:
                    startTime = now.Date;
                    break;
                case EnumNetworkUsageReportType.Weekly:
                    startTime = now.Date.AddDays(-(int)now.DayOfWeek);
                    break;
                case EnumNetworkUsageReportType.Monthly:
                    startTime = new DateTime(now.Year, now.Month, 1);
                    break;
                case EnumNetworkUsageReportType.Total:
                    startTime = DateTime.MinValue;
                    break;
                default:
                    throw new ArgumentException("Invalid report type");
            }

            var data = await dbContext.NetworkUsages
                .Where(u => u.Timestamp >= startTime)
                .GroupBy(u => u.InterfaceName)
                .Select(g => new
                {
                    InterfaceName = g.Key,
                    TotalBytesSent = g.Sum(u => u.BytesSent),
                    TotalBytesReceived = g.Sum(u => u.BytesReceived)
                })
                .ToListAsync();

            return new NetworkReport
            {
                ReportType = reportType,
                StartTime = startTime,
                EndTime = now,
                NetworkUsageReports = data.Select(d => new NetworkUsageReport
                {
                    InterfaceName = d.InterfaceName,
                    TotalBytesSent = d.TotalBytesSent,
                    TotalBytesReceived = d.TotalBytesReceived
                }).ToList()
            };
        }
    }
}