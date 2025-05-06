using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Data;

public interface IPropertyRepository : IBaseRepository<Property> {
    public Task<IEnumerable<Property>> GetAllWithFilters(
        string country,
        string state,
        string city,
        string zip,
        string address,
        decimal priceMax,
        decimal priceMin,
        int numBedroom,
        decimal numBathroom,
        bool forSale,
        Guid? guid);

    public void Update(PropertyUpdateDTO propertyInfo);
}