using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Project_2.API;
using Project_2.Services;
using Project_2.Models;

namespace Project_2.Pages
{
    public class PrivacyModel : LayoutModel
    {

        private readonly ILogger<PrivacyModel> _logger;

        public PrivacyModel(
            ILogger<PrivacyModel> logger,
            ILogger<LayoutModel> layoutLogger,
            UserManager<User> userManager)        
            : base(layoutLogger, userManager)     
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
