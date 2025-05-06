using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class FavoriteListForUserDTO
{
    public Guid PropertyId { get; set; }

    public DateTime Date { get; set; }
}