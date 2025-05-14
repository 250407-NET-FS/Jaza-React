using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public interface IPropertyService
{
    Task<IEnumerable<PropertyResponseDTO>> GetPropertiesAsync(
        string country,
        string state,
        string city,
        string zip,
        string address,
        string imageLink,
        decimal minprice,
        decimal maxprice,
        int bedrooms,
        decimal bathrooms,
        int garages,
        int pools,
        bool forsale,
        bool hasBasement,
        Guid? OwnerId);
    Task<Property?> GetPropertyByIdAsync(Guid guid);
    Task<IEnumerable<PropertyResponseDTO>> GetPropertiesWithinDistOfAsync(Guid propertyId, int meters);
    Task<IEnumerable<PropertySearchResponseDTO>> GetPropertiesByAddressCharsAsync(string addressChars);
    Task<Guid> AddNewPropertyAsync(PropertyAddDTO propertyInfo);
    Task UpdatePropertyAsync(PropertyUpdateDTO dto, Guid userId);
    Task RemovePropertyAsync(Guid propertyId, Guid? currentUserId);

    Task<IEnumerable<PropertyOwnerDTO>> GetPropertiesAdminAsync();

    Task<PropertyAddDTO> GetPropertyCoordinatesAsync(PropertyAddDTO dto);
}