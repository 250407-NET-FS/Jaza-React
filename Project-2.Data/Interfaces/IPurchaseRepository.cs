using Project_2.Models;

namespace Project_2.Data;

public interface IPurchaseRepository : IBaseRepository<Purchase>
{
    public Task<IEnumerable<Purchase>> GetAllByUser(Guid userId);
}