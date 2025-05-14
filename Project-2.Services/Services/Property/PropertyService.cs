using Project_2.Data;
using Project_2.Models;
using Project_2.Models.DTOs;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace Project_2.Services.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;

    //private readonly IHttpClientFactory _httpClientFactory;

    //private readonly string _googleApiKey;

    public PropertyService(IPropertyRepository propertyRepository, JazaContext context)
    {
        _propertyRepository = propertyRepository;
        //_httpClientFactory = httpClientFactory;
        //_googleApiKey = Environment.GetEnvironmentVariable("GOOGLE_API_KEY");
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

    public async Task<PropertyResponseDTO> GetPropertyByIdAsync(Guid guid)
    {
        return new PropertyResponseDTO(await _propertyRepository.GetByIdAsync(guid));
    }

    public async Task<IEnumerable<PropertyResponseDTO>> GetPropertiesWithinDistOfAsync(Guid propertyId, int meters) 
    {
        return await _propertyRepository.GetAllWithinDistOf(propertyId, meters);
    }
    
    public async Task<IEnumerable<PropertySearchResponseDTO>> GetPropertiesByAddressCharsAsync(string addressChars) 
    {
        return await _propertyRepository.GetAllLikeAddress(addressChars);
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

    // public async Task<PropertyAddDTO> GetPropertyCoordinatesAsync(PropertyAddDTO dto){
    //     var client = _httpClientFactory.CreateClient();
    //     string url = $"https://maps.googleapis.com/maps/api/geocode/json?address={dto.StreetAddress}&key={_googleApiKey}";
    //     var response = await client.GetAsync(url);

    //     if(response.IsSuccessStatusCode){
    //         var content = await response.Content.ReadAsStringAsync();

    //         using var doc = JsonDocument.Parse(content);
    //         var root = doc.RootElement;

    //         var result = root.GetProperty("results")[0];

    //         var location = result.GetProperty("geometry").GetProperty("location");
    //         dto.Latitude = location.GetProperty("lat").GetDouble();
    //         dto.Longitude = location.GetProperty("lng").GetDouble();
    //     } else {
    //         Console.WriteLine(_googleApiKey);
    //         throw new Exception("Failed to fetch property coordinates: " + response);
    //     }
    //     return dto;
    // }
}