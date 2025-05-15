using Project_2.Data;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public class PurchaseService : IPurchaseService
{
    private readonly IOfferRepository _offerRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IPurchaseRepository _purchaseRepository;

    public PurchaseService(IOfferRepository offerRepository, IPropertyRepository propertyRepository, IPurchaseRepository purchaseRepository)
    {
        _offerRepository = offerRepository;
        _propertyRepository = propertyRepository;
        _purchaseRepository = purchaseRepository;
    }

    public async Task<IEnumerable<Purchase>> GetAllPurchasesAsync()
    {
        return await _purchaseRepository.GetAllAsync();
    }

    public async Task<IEnumerable<PurchaseResponseDTO>> GetAllPurchasesByUserAsync(Guid userId)
    {
        IEnumerable<Purchase> purchasesToReturn = await _purchaseRepository.GetAllByUser(userId);
        if(purchasesToReturn is null){
            return null;
        }
        List<PurchaseResponseDTO> result = [];
        foreach(Purchase p in purchasesToReturn){
            result.Add(new PurchaseResponseDTO(p, userId));
        }
        return result;
    }

    public async Task<Purchase> AcceptOfferAsync(CreatePurchaseDTO purchaseDTO)
    {
        Property? property = (await _propertyRepository.GetByIdAsync(purchaseDTO.PropertyId))!;

        if (property is null || property.ForSale == false)
        {
            // throw new Exception(property is null ? "a" : "b");
            throw new Exception("Property not for sale");

        }

        if (property.OwnerID != purchaseDTO.UserId)
        {
            throw new Exception("Unauthorized");
        }

        Offer? offer = (await _offerRepository.GetByIdAsync(purchaseDTO.OfferId))!;
        if (offer is null)
        {
            throw new Exception("Offer does not exist");
        }

        // Insert record of new sale
        Purchase newPurchase = new Purchase(offer.UserID, property.PropertyID, offer.BidAmount); // use default datetime.now for time of purchase
        await _purchaseRepository.AddAsync(newPurchase);

        // Purge previous offers for the newly sold property
        _offerRepository.RemoveAllForProperty(property.PropertyID);

        // Update property to reflect new ownership
        PropertyUpdateDTO propertyInfo = new PropertyUpdateDTO() { 
            PropertyID = property.PropertyID, StreetAddress = property.StreetAddress, 
            City = property.City, State = property.State, Country = property.Country, 
            ZipCode = property.ZipCode, OwnerID = offer.UserID, ForSale = false 
        };

        _propertyRepository.Update(propertyInfo);
        Console.WriteLine("Break 1");

        // May appear to save property repository only but in the background
        // it's calling dbContext.SaveChanges and is saving changes to all repos
        await _propertyRepository.SaveChangesAsync();
        Console.WriteLine("Break 2");
        return newPurchase;
    }
}