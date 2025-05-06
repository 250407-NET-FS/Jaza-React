using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class PropertyAddDTO
{
    [Required]
    public string? Country { get; set; }
    [Required]
    public string? State { get; set; }
    [Required]
    public string? City { get; set; }
    [Required]
    public string? ZipCode { get; set; }
    [Required]
    public string? StreetAddress { get; set; }
    [Required]
    public decimal StartingPrice { get; set; }
    [Required]
    public int Bedrooms { get; set; }
    [Required]
    public decimal Bathrooms { get; set; }
    [Required]
    public DateTime ListDate { get; set; }
    [Required]
    public Guid OwnerID { get; set; }
}