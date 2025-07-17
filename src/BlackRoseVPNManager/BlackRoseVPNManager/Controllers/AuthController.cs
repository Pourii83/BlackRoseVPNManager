using BlackRoseVPNManager.Domain;
using BlackRoseVPNManager.Models.Auth;
using BlackRoseVPNManager.Services.Admin;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlackRoseVPNManager.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AuthController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthModel model)
    {
        var adminExisted = await _adminService.GetByUsername(model.Username) == null ? false : true;
        if (adminExisted)
            return BadRequest("Username already exists.");

        var admin = new Admin
        {
            Username = model.Username,
            Password = model.Password
        };
        await _adminService.Insert(admin);

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthModel model)
    {
        var admin = await _adminService.GetByUsernameAndPassword(model.Username, model.Password);
        if (admin == null)
            return Ok(new AuthModel {Success = false,Message= "نام کاربری یا رمزعبور اشتباه است!" });

        var token = Guid.NewGuid().ToString(); 
        
        return Ok(new AuthModel { Success = true, Message = "ورود موفقیت‌آمیز بود! 😊" , Token = token});
    }

    [HttpGet("check-auth")]
    public IActionResult CheckAuth()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "") ?? Request.Cookies["AuthToken"];
        if (string.IsNullOrEmpty(token))
            return Unauthorized("No token provided.");

        
        return Ok(new { message = "User is authenticated", username = "testuser" }); 
    }
}
