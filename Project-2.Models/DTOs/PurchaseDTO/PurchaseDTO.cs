using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class CreatePurchaseDTO
{
    [Required]
    public Guid PropertyId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid OfferId { get; set; }
    
}