using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Pages.Pages.EstateProperties
{
    [BindProperties]
    public class CreateModel(
        ILogger<LayoutModel> logger, UserManager<User> userManager,
        PropertyController controller
        ) : LayoutModel(logger, userManager)
    {
        private readonly PropertyController _controller = controller;
        private readonly UserManager<User> _userManager = userManager;

        public IActionResult OnGet()
        {
            return Page();
        }

        public PropertyAddDTO? PropertyInfo { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user is null){
                return RedirectToPage("../Auth/Login");
            }
            PropertyInfo!.OwnerID = user.Id;

            var actionResult = (await _controller.CreateProperty(PropertyInfo)).Result;
            if (actionResult is OkObjectResult okResult) {
                return RedirectToPage("./Retrieve", new { id = okResult.Value });
            }
            throw new Exception("Failed");
        }
    }
}