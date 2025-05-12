using Microsoft.EntityFrameworkCore;
using Project_2.Models;

namespace Project_2.Data;

public class FavoriteRepository : BaseRepository<Favorite>, IFavoriteRepository
{
    private readonly JazaContext _dbContext;

    public FavoriteRepository(JazaContext context) : base(context)
    {
        _dbContext = context;
    }

    public async Task<IEnumerable<Favorite>> GetAllForProperty(Guid propertyId)
    {
        return await _dbContext.Favorite.Where(f => f.PropertyID == propertyId).ToListAsync();
    }

    public async Task<IEnumerable<Favorite>> GetAllByUser(Guid userId)
    {
        return await _dbContext.Favorite.Where(f => f.UserID == userId).ToListAsync();
    }

    // get top 5 favorite by linq and db directly
    public async Task<IEnumerable<Property>> GetTopFavoritedPropertiesAsync(int count)
    {
        return await _dbContext.Property
    .OrderByDescending(p => _dbContext.Favorite
        .Count(f => f.PropertyID == p.PropertyID))
    .Take(count)
    .ToListAsync();
    }
}
