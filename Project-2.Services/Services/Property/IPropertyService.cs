using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public interface IPropertyService
{
    Task<IEnumerable<Property>> GetPropertiesAsync(
        string country,
        string state,
        string city,
        string zip,
        string address,
        decimal minprice,
        decimal maxprice,
        int bedrooms,
        decimal bathrooms,
        bool forsale,
        Guid? OwnerId);
    Task<Property?> GetPropertyByIdAsync(Guid guid);
    Task<Guid> AddNewPropertyAsync(PropertyAddDTO propertyInfo);
    Task UpdatePropertyAsync(PropertyUpdateDTO dto, Guid userId);
    Task RemovePropertyAsync(Guid propertyId, Guid? currentUserId);
}