using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Project_2.Models;

[Table("Favorites")]
public class Favorite
{
    [Key]
    public Guid FavoriteID { get; set; } = Guid.NewGuid();
    [Required]
    [ForeignKey(nameof(User))]
    public Guid UserID { get; set; } 
    [Required]
    [ForeignKey(nameof(Property))]
    public Guid PropertyID { get; set; }

    public DateTime Date { get; set; } = DateTime.Now;

    public Favorite(){}

    public Favorite(Guid propertyId, Guid userId){
        PropertyID = propertyId;
        UserID = userId;
    }

    // Navigations
    #nullable disable
    public User User { get; init; }
    public Property Property { get; init; }
    #nullable restore
}