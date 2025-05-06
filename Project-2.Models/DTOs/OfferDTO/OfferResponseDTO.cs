using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class OfferResponseDTO
{
    public Guid OfferId { get; set; }
    public Guid UserId { get; set; }
    public Guid PropertyId { get; set; }
    public decimal BidAmount { get; set; }
    public DateTime Date { get; set; }

}