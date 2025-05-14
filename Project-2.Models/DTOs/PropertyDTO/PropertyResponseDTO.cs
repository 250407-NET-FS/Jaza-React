namespace Project_2.Models.DTOs;

public class PropertyResponseDTO
{
    public Guid PropertyID { get; set; }
    public string Country { get; set; } = null!;
    public string State { get; set; } = null!;
    public string City { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
    public string StreetAddress { get; set; } = null!;
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public string? ImageLink { get; set; }
    public decimal StartingPrice { get; set; }
    public int Bedrooms { get; set; }
    public decimal Bathrooms { get; set; }
    public int Garages { get; set; }
    public int Pools { get; set; }
    public bool HasBasement { get; set; }
    public DateTime ListDate { get; set; }
    public Guid OwnerID { get; set; }
    public bool ForSale { get; set; }
    
    public PropertyResponseDTO(Property property) {
        PropertyID = property.PropertyID;
        Country = property.Country!;
        State = property.State!;
        City = property.City!;
        ZipCode = property.ZipCode!;
        StreetAddress = property.StreetAddress!;
        Longitude = property.Coordinates!.Y;
        Latitude = property.Coordinates!.X;
        ImageLink = property.ImageLink;
        StartingPrice = property.StartingPrice;
        Bedrooms = property.Bedrooms;
        Bathrooms = property.Bathrooms;
        Garages = property.Garages;
        Pools = property.Pools;
        HasBasement = property.HasBasement;
        ListDate = property.ListDate;
        OwnerID = (Guid)property.OwnerID!;
        ForSale = property.ForSale;
    }
}