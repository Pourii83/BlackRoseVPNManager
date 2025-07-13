using BlackRoseVPNManager.Domain;
using Microsoft.EntityFrameworkCore;

namespace BlackRoseVPNManager.Data;

public class BlackRoseDbContext:DbContext
{
    public BlackRoseDbContext(DbContextOptions<BlackRoseDbContext> options)
        : base(options)
    {
    }

    public DbSet<Admin> Admins{ get; set; }
}
