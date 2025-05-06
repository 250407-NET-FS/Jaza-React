using Microsoft.AspNetCore.Identity;
using Project_2.Data;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services;

public class OfferService : IOfferService
{
    private readonly UserManager<User> _userManager;
    private readonly IOfferRepository _offerRepository;
    private readonly IPropertyRepository _propertyRepository;

    public OfferService(UserManager<User> userManager, IOfferRepository offerRepository, IPropertyRepository propertyRepository)
    {
        _userManager = userManager;
        _offerRepository = offerRepository;
        _propertyRepository = propertyRepository;
    }

    public async Task<IEnumerable<OfferResponseDTO>> GetAllAsync()
    {
        IEnumerable<Offer> offers = await _offerRepository.GetAllAsync();
        return offers.Select(o => new OfferResponseDTO
        {
            OfferId = o.OfferID,
            UserId = o.UserID,
            PropertyId = o.PropertyID,
            BidAmount = o.BidAmount,
            Date = o.Date

        });
    }

    public async Task<OfferResponseDTO?> GetByIdAsync(Guid id)
    {
        Offer? offer = await _offerRepository.GetByIdAsync(id);
        if (offer is null) throw new Exception("Offer not found");
        return new OfferResponseDTO
        {
            OfferId = offer.OfferID,
            UserId = offer.UserID,
            PropertyId = offer.PropertyID,
            BidAmount = offer.BidAmount,
            Date = offer.Date
        };
    }

    public async Task<OfferResponseDTO> AddAsync(OfferNewDTO dto)
    {
        // check if property exists
        Property? property = await _propertyRepository.GetByIdAsync(dto.PropertyId);
        if (property is null)
            throw new Exception("Property cannot be null");

        // check if user exists
        User? user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        if (user is null)
            throw new Exception("User cannot be null");

        // check if the Bid Ammount is a postive number
        if (dto.BidAmount <= 0.00m)
            throw new Exception("Bid amount must be greater than zero");

        // create new offer using dto
        Offer offer = new Offer(dto.UserId, dto.PropertyId, dto.BidAmount);

        // add to database
        await _offerRepository.AddAsync(offer);
        // save database
        await _offerRepository.SaveChangesAsync();

        return new OfferResponseDTO
        {
            OfferId = offer.OfferID,
            UserId = offer.UserID,
            PropertyId = offer.PropertyID,
            BidAmount = offer.BidAmount,
            Date = offer.Date
        };
    }

    public async Task RemoveAsync(Guid offerId)
    {
        // Get offer to be removed
        Offer? offer = await _offerRepository.GetByIdAsync(offerId);

        // if offer did not exist throw error
        if (offer is null)
            throw new Exception("Offer not found");

        // remove offer from databse
        _offerRepository.Remove(offer);

        // save changes to databse
        await _offerRepository.SaveChangesAsync();
    }

    public async Task<IEnumerable<OfferResponseDTO>> GetAllForPropertyAsync(Guid propertyId)
    {
        // check if property exist
        Property? property = await _propertyRepository.GetByIdAsync(propertyId);
        if (property is null)
            throw new Exception("Property does not exist");

        // get list of offers for property
        IEnumerable<Offer> offers = await _offerRepository.GetAllForProperty(propertyId);

        // return the list of property's offers with dto
        return offers.Select(o => new OfferResponseDTO
        {
            OfferId = o.OfferID,
            UserId = o.UserID,
            PropertyId = o.PropertyID,
            BidAmount = o.BidAmount,
            Date = o.Date

        });
    }


    public async Task<IEnumerable<OfferResponseDTO>> GetAllByUserAsync(Guid userId)
    {
        // check if user exist
        User? user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            throw new Exception("User does not exist.");

        // get list of offers made by user
        IEnumerable<Offer> offers = await _offerRepository.GetAllByUser(userId);

        // return the list of user's offers with dto
        return offers.Select(o => new OfferResponseDTO
        {
            OfferId = o.OfferID,
            UserId = o.UserID,
            PropertyId = o.PropertyID,
            BidAmount = o.BidAmount,
            Date = o.Date

        });
    }

    // can be used for admin or used
    public async Task<IEnumerable<OfferResponseDTO>> SearchOffersAsync(OfferSearchDTO dto)
    {
        if (dto is null)
            throw new ArgumentException("At least one search criterion (OfferId, UserId, or PropertyId) must be provided");

        IEnumerable<Offer> offers = await _offerRepository.GetAllAsync();

        if (dto.OfferId.HasValue)
            offers = offers.Where(o => o.OfferID == dto.OfferId.Value).ToList();

        if (dto.UserId.HasValue)
            offers = offers.Where(o => o.UserID == dto.UserId.Value).ToList();

        if (dto.PropertyId.HasValue)
            offers = offers.Where(o => o.PropertyID == dto.PropertyId.Value).ToList();

        return offers.Select(o => new OfferResponseDTO
        {
            OfferId = o.OfferID,
            UserId = o.UserID,
            PropertyId = o.PropertyID,
            BidAmount = o.BidAmount,
            Date = o.Date

        });
    }
}