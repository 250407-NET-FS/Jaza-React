using Microsoft.EntityFrameworkCore;
using Project_2.Models;

namespace Project_2.Data;

public class PurchaseRepository : BaseRepository<Purchase>, IPurchaseRepository
{
    private readonly JazaContext _dbContext;
    public PurchaseRepository(JazaContext context) : base(context)
    {
        _dbContext = context;
    }

    public async Task<IEnumerable<Purchase>> GetAllByUser(Guid userId)
    {
        return await _dbContext.Purchase.Where(f => f.OwnerID == userId).OrderByDescending(f => f.Date).ToListAsync();
    }

}