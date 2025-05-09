public class PropertyOwnerDTO
{
    public Guid PropertyID { get; set; }
    public string? Address { get; set; }
    public decimal StartingPrice { get; set; }

    public Guid? OwnerID { get; set; }
    public string? OwnerEmail { get; set; }
    public string? OwnerFullName { get; set; }
}
