using Project_2.Models;

namespace Project_2.Data;

public interface IFavoriteRepository : IBaseRepository<Favorite>
{
    public Task<IEnumerable<Favorite>> GetAllForProperty(Guid propertyId);
    public Task<IEnumerable<Favorite>> GetAllByUser(Guid userId);

    public Task<IEnumerable<Property>> GetTopFavoritedPropertiesAsync(int count);
}