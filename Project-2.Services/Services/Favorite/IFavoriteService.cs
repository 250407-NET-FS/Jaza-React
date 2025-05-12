using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public interface IFavoriteService
{
    Task<IEnumerable<Favorite>> GetAllFavoritesAsync();
    Task MarkUnmarkFavoriteAsync(FavoritesDTO dto);
    Task<bool> CheckFavoritedAsync(FavoritesGetDTO dto);
    Task<IEnumerable<FavoritesDTO>> GetAllForPropertyAsync(Guid propertyId); // unused stretch goal 
    Task<IEnumerable<FavoriteListForUserDTO>> GetAllByUserAsync(Guid userId);
    Task<IEnumerable<Property>> GetTopFavoritedPropertiesAsync(int count);
}