using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Project_2.Models;

namespace Project_2.Data;

public interface IOfferRepository : IBaseRepository<Offer> {
    public Task<IEnumerable<Offer>> GetAllForProperty(Guid propertyId);
    public Task<IEnumerable<Offer>> GetAllByUser(Guid userId);
    public void RemoveAllForProperty(Guid propertyId);
}