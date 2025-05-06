using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Project_2.Models;

[Table("Purchases")]
public class Purchase(Guid OwnerID, Guid PropertyID, decimal FinalPrice)
{
    [Key]
    public Guid PurchaseID { get; set; } = Guid.NewGuid();
    [Required]
    [ForeignKey(nameof(Owner))]
    public Guid OwnerID { get; set; } = OwnerID;    
    [Required]
    [ForeignKey(nameof(Property))]
    public Guid PropertyID { get; set; } = PropertyID;
    [Required]
    [Precision(18, 2)]
    public decimal FinalPrice { get; set; } = FinalPrice;
    public DateTime Date { get; set; } = DateTime.Now;

    // Navigations
    #nullable disable
    public User Owner { get; init; }
    public Property Property { get; init; }
    #nullable restore
}