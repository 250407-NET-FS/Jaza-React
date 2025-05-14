using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Services.Services;

public interface IPurchaseService
{
    Task<IEnumerable<Purchase>> GetAllPurchasesAsync();
    Task<IEnumerable<PurchaseResponseDTO>> GetAllPurchasesByUserAsync(Guid userId);
    Task<Purchase> AcceptOfferAsync(CreatePurchaseDTO purchaseDTO);
}