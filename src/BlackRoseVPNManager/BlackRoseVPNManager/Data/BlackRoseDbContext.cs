using BlackRoseVPNManager.Domain;
using BlackRoseVPNManager.Models.NetworkMonitor;
using Microsoft.EntityFrameworkCore;

namespace BlackRoseVPNManager.Data;

public class BlackRoseDbContext:DbContext
{
    public BlackRoseDbContext(DbContextOptions<BlackRoseDbContext> options)
        : base(options)
    {
    }

    public DbSet<Admin> Admins{ get; set; }
    public DbSet<NetworkUsage> NetworkUsages { get; set; }

}
