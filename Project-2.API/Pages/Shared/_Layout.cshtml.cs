// /Pages/Shared/LayoutModel.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Project_2.Services;
using Project_2.Models;

namespace Project_2.Pages
{
    public class LayoutModel : PageModel
    {

        private readonly ILogger<LayoutModel> _logger;


        public LayoutModel(ILogger<LayoutModel> logger, UserManager<User> userManager)
        {
            _logger = logger;
        }

        
        public bool IsLoggedIn() => User.Identity?.IsAuthenticated ?? false;

        public IActionResult OnPostLogout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions { Path = "/" });
        
            return RedirectToPage("./Index");
           
        }
    }
}
