using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Models;
using Project_2.Services.Services;

namespace Project_2.Pages.Pages.Admin
{
    [Authorize(Roles = "Admin")]
    class PropertyModel(PropertyService propertyService, ILogger<IndexModel> logger,
       UserManager<User> userManager
       ) : LayoutModel(logger, userManager)
    {
        private readonly PropertyService _propertyService = propertyService;
        private readonly UserManager<User> _userManager = userManager;

        public async Task<IActionResult> OnGetAsync()
        {
            PropertyList = (List<Property>?)await _propertyService.GetPropertiesAsync("", "", "", "", "", -1, -1, -1, -1, false, null);

            foreach (Property property in PropertyList)
            {
                User owner = await _userManager.FindByIdAsync(property.OwnerID.ToString());
                OwnerList!.Add(owner);
            }
            return Page();
        }

        [BindProperty]
        public List<Property>? PropertyList { get; set; }
        public List<User> OwnerList { get; set; } = [];

        public async Task<IActionResult> OnPostDeleteAsync(Guid Propertyid, Guid OwnerId)
        {
            await _propertyService.RemovePropertyAsync(Propertyid, OwnerId);
            return RedirectToPage();
        }
    }
}