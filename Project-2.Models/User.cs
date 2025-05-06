using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;

namespace Project_2.Models;

public class User : IdentityUser<Guid>
{
    //All of our previous methods are already built in due to the inheritance.
    public string? FullName {get; set;}
}