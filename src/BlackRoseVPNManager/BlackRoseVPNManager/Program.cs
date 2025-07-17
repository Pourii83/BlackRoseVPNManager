using BlackRoseVPNManager.Data;
using BlackRoseVPNManager.Hubs;
using BlackRoseVPNManager.Services.Admin;
using BlackRoseVPNManager.Services.NetworkMonitor;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register DbContext with MySQL
builder.Services.AddDbContext<BlackRoseDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 31))
    ));

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

builder.Services.AddSignalR();

// Register services
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddHostedService<NetworkMonitorService>(); // For background service
builder.Services.AddScoped<NetworkMonitorService>(); // For controller injection

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(myAllowSpecificOrigins); // CORS must be after UseRouting and before UseAuthorization
app.UseAuthorization(); // UseAuthorization must be after UseRouting and before UseEndpoints
app.MapHub<SystemMonitorHub>("/systemMonitorHub");
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BlackRoseDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
}

app.Run();