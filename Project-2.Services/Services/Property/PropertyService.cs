using Project_2.Data;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;

    public PropertyService(IPropertyRepository propertyRepository, JazaContext context)
    {
        _propertyRepository = propertyRepository;
    }

    public async Task<IEnumerable<PropertyResponseDTO>> GetPropertiesAsync(
        string country,
        string state,
        string city,
        string zip,
        string address,
        string imageLink,
        decimal minPrice,
        decimal maxPrice,
        int bedrooms,
        decimal bathrooms,
        int garages,
        int pools,
        bool forSale,
        bool hasBasement,
        Guid? OwnerId
    )
    {
        IEnumerable<Property> propertyList = await _propertyRepository.GetAllWithFilters(
            country, state, city, zip, address, minPrice, maxPrice, bedrooms,
            bathrooms, garages, pools, forSale, hasBasement, OwnerId
        );
        return propertyList.Select(p => new PropertyResponseDTO(p));
    }

    public async Task<PropertyResponseDTO?> GetPropertyByIdAsync(Guid guid)
    {
        Property p = await _propertyRepository.GetByIdAsync(guid);
        return new PropertyResponseDTO(p);
    }

    public async Task<IEnumerable<PropertyResponseDTO>> GetPropertiesWithinDistOfAsync(Guid propertyId, int meters) {
        return await _propertyRepository.GetAllWithinDistOf(propertyId, meters);
    }

    public async Task<Guid> AddNewPropertyAsync(PropertyAddDTO propertyInfo)
    {
        Property newProperty = new Property(
            propertyInfo.Country!, propertyInfo.State!, propertyInfo.City!,
            propertyInfo.ZipCode!, propertyInfo.StreetAddress!, propertyInfo.Latitude,
            propertyInfo.Longitude, propertyInfo.ImageLink!, propertyInfo.StartingPrice!, 
            propertyInfo.Bedrooms!, propertyInfo.Bathrooms!, propertyInfo.Garages!, 
            propertyInfo.Pools!, propertyInfo.HasBasement!, propertyInfo.OwnerID
        );

        await _propertyRepository.AddAsync(newProperty);

        int result = await _propertyRepository.SaveChangesAsync();
        if (result < 1)
        {
            throw new Exception("Failed to insert property");
        }

        return newProperty.PropertyID;
    }

    public async Task UpdatePropertyAsync(PropertyUpdateDTO dto, Guid userId)
    {
        Property? propertyToUpdate = await _propertyRepository.GetByIdAsync(dto.PropertyID);
        if (propertyToUpdate is null)
        {
            throw new Exception("Property not found");
        }

        if (propertyToUpdate.OwnerID != userId)
        {
            throw new Exception("Unauthorized");
        }

        _propertyRepository.Update(dto);

        int result = await _propertyRepository.SaveChangesAsync();
        if (result < 1)
        {
            throw new Exception("Failed to update property");
        }
    }

    public async Task RemovePropertyAsync(Guid propertyId, Guid? userId)
    {
        Property? propertyToRemove = await _propertyRepository.GetByIdAsync(propertyId);
        if (propertyToRemove is null)
        {
            throw new Exception("Property not found");
        }

        if (userId is not null && propertyToRemove.OwnerID != userId)
        { //we might want to check if role of user might be admin as another one
            throw new Exception("Unauthorized");
        }

        _propertyRepository.Remove(propertyToRemove);

        int result = await _propertyRepository.SaveChangesAsync();
        if (result < 1)
        {
            throw new Exception("Failed to delete property");
        }
    }

    public async Task<IEnumerable<PropertyOwnerDTO>> GetPropertiesAdminAsync()
    {
        return await _propertyRepository.GetPropertiesAdminAsync();
    }
}