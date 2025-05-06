using Microsoft.EntityFrameworkCore;
using Project_2.Models;

namespace Project_2.Data;

public class OfferRepository : BaseRepository<Offer>, IOfferRepository {
    private readonly JazaContext _dbContext; 

    public OfferRepository(JazaContext context) : base(context) {
        _dbContext = context;
    }

    public async Task<IEnumerable<Offer>> GetAllForProperty(Guid propertyId) {
        return await _dbContext.Offer.Where(f => f.PropertyID == propertyId).ToListAsync();
    }

    public  async Task<IEnumerable<Offer>> GetAllByUser(Guid userId) {
        return await _dbContext.Offer.Where(f => f.UserID == userId).OrderByDescending(f => f.Date).ToListAsync();
    }

    /* Marks a range of entitites as to-be-deleted until their removal from the db
     * in the next SaveChanges() call. 
     * ENSURE that SaveChanges() is called after this, as it has no effect otherwise
     */
    public void RemoveAllForProperty(Guid propertyId) {
        _dbContext.Property.RemoveRange(_dbContext.Property.Where(p => p.PropertyID == propertyId));
    }
}