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

    public async Task<PropertyResponseDTO?> GetPropertyByIdAsync(Guid guid)
    {
        Property? propertyToReturn = await _propertyRepository.GetByIdAsync(guid);
        return (propertyToReturn is null) ? null : new PropertyResponseDTO(propertyToReturn);
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

        newProperty.ImageLink = PropertyLinks.GetRandom();
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
public static class PropertyLinks
{
    public static string[] Links = ["https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-binyaminmellish-106399.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-binyaminmellish-1396122.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-binyaminmellish-186077.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-davidmcbee-1546166.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-expect-best-79873-323780.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-frans-van-heerden-201846-1438832.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-itsterrymag-2635038.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-luis-yanez-57302-206172.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixabay-164558.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixabay-259588.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixabay-280222.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixabay-280229.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixabay-358636.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-pixasquare-1115804.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-scottwebb-1029599.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-sebastians-731082.jpg",
"https://raw.githubusercontent.com/250407-NET-FS/Jaza-React/main/JAZA-FRONT/src/assets/pexels-thgusstavo-2102587.jpg"
];

    
    private static readonly Random _rng = new Random();

    public static string GetRandom() =>
        Links[_rng.Next(Links.Length)];
}