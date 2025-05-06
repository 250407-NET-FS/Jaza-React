using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.Models;
using Project_2.API;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Project_2.Pages.Pages.Admin;
[Authorize(Roles = "Admin")]
public class AdminIndexModel(
    ILogger<IndexModel> logger,
    UserManager<User> userManager,
    PropertyController propertyController

    ) : LayoutModel(logger, userManager)
{
    private readonly ILogger<IndexModel> _logger = logger;
    private readonly UserManager<User> _userManager = userManager;
    private readonly PropertyController _propertyController = propertyController;



    public User? Admin {get; set;}
}