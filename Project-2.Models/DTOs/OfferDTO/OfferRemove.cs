using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class OfferRemoveDTO
{
    public Guid? OfferId { get; set; }

    public Guid? UserId { get; set; }

    public Guid? PropertyId { get; set; }

}