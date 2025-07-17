namespace BlackRoseVPNManager.Models.NetworkMonitor
{
    public class NetworkUsageReport
    {
        public string InterfaceName { get; set; }
        public long TotalBytesSent { get; set; }
        public long TotalBytesReceived { get; set; }
    }
}