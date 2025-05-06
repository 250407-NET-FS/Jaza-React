namespace Project_2.Models.DTOs;

public class PropertyResponseDTO
{
    public Guid PropertyID { get; set; }
    public string Country { get; set; } = null!;
    public string State { get; set; } = null!;
    public string City { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
    public string StreetAddress { get; set; } = null!;
    public string? ImageLink { get; set; }
    public decimal StartingPrice { get; set; }
    public int Bedrooms { get; set; }
    public decimal Bathrooms { get; set; }
    public int Pools { get; set; }
    public bool HasBasement { get; set; }
    public DateTime ListDate { get; set; }
    public Guid OwnerID { get; set; }
    public bool ForSale { get; set; }
}