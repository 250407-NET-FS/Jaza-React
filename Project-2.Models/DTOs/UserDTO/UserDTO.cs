using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class UserDTO
{
    [Required]
    public string? Name { get; set; }
    [Required]
    public string? Email { get; set; }

}