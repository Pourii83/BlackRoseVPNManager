namespace BlackRoseVPNManager.Services.Admin;

public interface IAdminService
{
    Task<IList<Domain.Admin>> GetAll();
    Task<Domain.Admin> GetById(int id);
    Task<Domain.Admin> GetByUsername(string username);
    Task<Domain.Admin> GetByUsernameAndPassword(string username,string password);
    Task<Domain.Admin> Insert(Domain.Admin admin);
    Task<Domain.Admin> Update(Domain.Admin admin);
    Task DeleteById(int id);
}
