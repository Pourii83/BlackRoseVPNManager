using BlackRoseVPNManager.Data;
using BlackRoseVPNManager.Hubs;
using BlackRoseVPNManager.Services.Admin;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

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

builder.Services.AddScoped<IAdminService, AdminService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(myAllowSpecificOrigins); // CORS باید بعد از UseRouting و قبل از UseAuthorization باشد
app.UseAuthorization(); // UseAuthorization باید بعد از UseRouting و قبل از UseEndpoints باشد
app.MapHub<SystemMonitorHub>("/systemMonitorHub");
app.MapControllers();

app.Run();