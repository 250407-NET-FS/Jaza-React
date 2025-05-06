using Microsoft.EntityFrameworkCore;
using Project_2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Project_2.Data;

public class JazaContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public JazaContext(DbContextOptions<JazaContext> options) : base(options) { }


    public DbSet<Favorite> Favorite { get; set; }
    public DbSet<Offer> Offer { get; set; }
    public DbSet<Property> Property { get; set; }
    public DbSet<Purchase> Purchase { get; set; }

}