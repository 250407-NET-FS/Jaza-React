using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using Project_2.API;
using Project_2.Models;
using Project_2.Services.Services;

namespace Project_2.Pages.Pages.Owner
{
    [BindProperties]
    class PropertyModel(ILogger<LayoutModel> logger, UserManager<User> userManager, PropertyService propertyService, UserController userController) : LayoutModel(logger, userManager)
    {
        private readonly ILogger<LayoutModel> _logger = logger;
        private readonly UserManager<User> _userManager = userManager;
        private readonly PropertyService _propertyService = propertyService;
        private readonly UserController _userController = userController;

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null){
                return RedirectToPage("../Auth/Login");
            }

            PropertyList = (await _propertyService.GetPropertiesAsync("", "", "", "", "", -1, -1, -1, -1, false, user.Id)).ToList();
            
            return Page();
        }

        public List<Property>? PropertyList { get; set; }
        public User? Owner { get; set; }

        public async Task<IActionResult> OnDeleteAsync(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null){
                return RedirectToPage("../Auth/Login");
            }
            await _propertyService.RemovePropertyAsync(id, user.Id);
            PropertyList = (await _propertyService.GetPropertiesAsync("", "", "", "", "", -1, -1, -1, -1, false, user.Id)).ToList();
            return Page();
        }
    }
}