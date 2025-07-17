namespace BlackRoseVPNManager.Models.Auth;

public class AuthModel
{
    public string Username { get; set; }
    public string Password { get; set; }
    public bool? Success { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }

}
