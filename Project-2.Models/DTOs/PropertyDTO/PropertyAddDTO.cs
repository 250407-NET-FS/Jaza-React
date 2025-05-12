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
    public double Latitude { get; set; }
    [Required]
    public double Longitude { get; set; }
    public string? ImageLink { get; set; }
    [Required]
    public decimal StartingPrice { get; set; }
    [Required]
    public int Bedrooms { get; set; }
    [Required]
    public decimal Bathrooms { get; set; }
    [Required]
    public int Garages { get; set; }
    [Required]
    public int Pools { get; set; }
    public bool HasBasement { get; set;} 
    [Required]
    public DateTime ListDate { get; set; }
    [Required]
    public Guid OwnerID { get; set; }
}