using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services;

public interface IOfferService
{
    Task<IEnumerable<OfferResponseDTO>> GetAllAsync();
    Task<OfferResponseDTO?> GetByIdAsync(Guid id);
    Task<OfferResponseDTO> AddAsync(OfferNewDTO dto);
    Task RemoveAsync(Guid offerId);
    Task<IEnumerable<OfferResponseDTO>> GetAllForPropertyAsync(Guid propertyId);
    Task<IEnumerable<OfferResponseDTO>> GetAllByUserAsync(Guid userId);
    Task<IEnumerable<OfferResponseDTO>> SearchOffersAsync(OfferSearchDTO dto);
}