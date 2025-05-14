using System.ComponentModel.DataAnnotations;

namespace Project_2.Models.DTOs;

public class PurchaseResponseDTO{
    public Guid PurchaseId { get; set; }
    public Guid PropertyId { get; set; }
    public Guid BuyerId { get; set; }
    public DateTime PurchaseDate { get; set; }
    public decimal PurchaseAmount { get; set; }


    public PurchaseResponseDTO(Purchase purchase, Guid buyerId){
        PurchaseId = purchase.PurchaseID;
        PropertyId = purchase.PropertyID;
        BuyerId = buyerId;
        PurchaseDate = purchase.Date;
        PurchaseAmount = purchase.FinalPrice;
    }
}