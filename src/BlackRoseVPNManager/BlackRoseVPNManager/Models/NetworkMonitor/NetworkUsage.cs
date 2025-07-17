namespace BlackRoseVPNManager.Models.NetworkMonitor
{
    public class NetworkUsage
    {
        public int Id { get; set; }
        public string InterfaceName { get; set; }
        public long BytesSent { get; set; }
        public long BytesReceived { get; set; }
        public DateTime Timestamp { get; set; }
    }
}