using BlackRoseVPNManager.Data;
using Microsoft.EntityFrameworkCore;

namespace BlackRoseVPNManager.Services.Admin;

public class AdminService : IAdminService
{
    private readonly BlackRoseDbContext _context;
    public AdminService(BlackRoseDbContext context)
    {
        _context = context;
    }
    public async Task<IList<Domain.Admin>> GetAll()
    {
        return await _context.Admins.ToListAsync();
    }
    public async Task<Domain.Admin> GetById(int id)
    {
        return await _context.Admins.FindAsync(id);
    }
    public async Task<Domain.Admin> GetByUsername(string username)
    {
        return await _context.Admins.Where(c => c.Username == username).FirstOrDefaultAsync();
    }
    public async Task<Domain.Admin> GetByUsernameAndPassword(string username, string password)
    {
        return await _context.Admins.FirstOrDefaultAsync(c => c.Username == username && c.Password == password);
    }
    public async Task<Domain.Admin> Insert(Domain.Admin admin)
    {
        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();
        return admin;
    }
    public async Task<Domain.Admin> Update(Domain.Admin admin)
    {
        _context.Admins.Update(admin);
        await _context.SaveChangesAsync();
        return admin;
    }
    public async Task DeleteById(int id)
    {
        var admin = await GetById(id);
        if (admin != null)
        {
            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
        }
    }
}