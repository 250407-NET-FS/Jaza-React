using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class OfferNewDTO
{
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid PropertyId { get; set; }
    [Required]
    public decimal BidAmount { get; set; }

}