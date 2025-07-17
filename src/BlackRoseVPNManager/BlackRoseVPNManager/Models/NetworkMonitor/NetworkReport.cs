namespace BlackRoseVPNManager.Models.NetworkMonitor
{
    public class NetworkReport
    {
        public EnumNetworkUsageReportType ReportType { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public List<NetworkUsageReport> NetworkUsageReports { get; set; }
    }
}