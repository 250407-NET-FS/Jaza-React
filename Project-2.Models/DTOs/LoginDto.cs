using System.ComponentModel.DataAnnotations;

namespace Project_2.Models;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    
    public string? FullName { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string? Password { get; set; }
}