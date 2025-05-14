namespace Project_2.Models.DTOs;

public class PropertySearchResponseDTO {
    public Guid PropertyID { get; set; }
    public string? State { get; set; }
    public string? City { get; set; }
    public string? ZipCode { get; set; }
    public string? StreetAddress { get; set; }

    public PropertySearchResponseDTO(Property property) {
        PropertyID = property.PropertyID;
        State = property.State;
        City = property.City;
        ZipCode = property.ZipCode;
        StreetAddress = property.StreetAddress;
    }
}