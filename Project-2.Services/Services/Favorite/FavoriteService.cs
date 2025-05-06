using Microsoft.AspNetCore.Identity;
using Project_2.Data;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly UserManager<User> _userManager;

    public FavoriteService(IFavoriteRepository favoriteRepository, IPropertyRepository propertyRepository, UserManager<User> userManager)
    {
        _favoriteRepository = favoriteRepository;
        _propertyRepository = propertyRepository;
        _userManager = userManager;
    }

    public async Task<IEnumerable<Favorite>> GetAllFavoritesAsync()
    {
        IEnumerable<Favorite> favorites = await _favoriteRepository.GetAllAsync();
        return favorites;
    }

    public async Task MarkUnmarkFavoriteAsync(FavoritesDTO dto)
    {
        // check if property exists
        Property? property = await _propertyRepository.GetByIdAsync(dto.PropertyId);
        if (property is null)
            throw new Exception("Property cannot be null");

        // check if user exists
        User? user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        if (user is null)
            throw new Exception("User cannot be null");

        IEnumerable<Favorite> favs = await _favoriteRepository.GetAllByUser(dto.UserId);
        Favorite? favoriteToRemove = favs.FirstOrDefault(f => f!.PropertyID == dto.PropertyId, null);

        if (favoriteToRemove is null) {
            // no favorite exists, favorite it
            Favorite favorite = new Favorite(dto.PropertyId, dto.UserId);
            await _favoriteRepository.AddAsync(favorite);
        }
        else {
            // favorite exists, unfavorite it
            _favoriteRepository.Remove(favoriteToRemove);
        }

        // save database
        await _favoriteRepository.SaveChangesAsync();
    }

    public async Task<bool> CheckFavoritedAsync(FavoritesGetDTO dto) {
        if (dto.UserId is null) {
            // user not logged in
            return false;
        }

        IEnumerable<Favorite> favs = await _favoriteRepository.GetAllByUser((Guid)dto.UserId);
        return favs.Any(f => f.PropertyID == dto.PropertyId);
    }

    public async Task<IEnumerable<FavoritesDTO>> GetAllForPropertyAsync(Guid propertyId)
    {
        // check if property exist
        Property? property = await _propertyRepository.GetByIdAsync(propertyId);
        if (property is null)
            throw new Exception("Property does not exist");

        // get list of favorites for property
        IEnumerable<Favorite> favorites = await _favoriteRepository.GetAllForProperty(propertyId);

        // return the list of property's favorites with dto
        return favorites.Select(f => new FavoritesDTO
        {
            UserId = f.UserID,
            PropertyId = f.PropertyID,
        });
    }

    public async Task<IEnumerable<FavoriteListForUserDTO>> GetAllByUserAsync(Guid userId)
    {
        // check if user exist
        User? user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            throw new Exception("User does not exist");

        // get list of favorites for user
        IEnumerable<Favorite> favorites = await _favoriteRepository.GetAllByUser(userId);

        // return the list of user's favorites with dto
        return favorites.Select(f => new FavoriteListForUserDTO
        {
            PropertyId = f.PropertyID,
            Date = f.Date
        });
    }
}