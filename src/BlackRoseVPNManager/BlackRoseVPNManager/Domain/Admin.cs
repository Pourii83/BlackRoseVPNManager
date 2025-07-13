namespace BlackRoseVPNManager.Domain;

public class Admin
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public bool IsSystemAdmin { get; set; }
}
