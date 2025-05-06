using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Services;
using Project_2.Models;
using Microsoft.AspNetCore.Identity;

namespace Project_2.Pages.Pages.Auth
{
    public class RegisterModel : LayoutModel
    {

        private readonly ILogger<RegisterModel> _logger;
        private readonly UserManager<User> _userManager;


        public RegisterModel(
            //AuthUserController authUserController   ,
            ILogger<RegisterModel> logger,
            ILogger<LayoutModel> layoutLogger,
            UserManager<User> userManager)
            : base(layoutLogger, userManager)
        {
            _logger = logger;
            _userManager = userManager;

        }

        public IActionResult OnGet()
        {
            return Page();
        }


        [TempData]
        public string? StatusMessage { get; set; }
        [BindProperty]
        public RegisterDto? UserInfo { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
                return Page();

            var user = new User
            {
                UserName = UserInfo.Email,
                Email = UserInfo.Email,
                FullName = UserInfo.FullName
            };

            var result = await _userManager.CreateAsync(user, UserInfo.Password);

            if (!result.Succeeded)
            {
                
                foreach (var error in result.Errors)
                    ModelState.AddModelError(string.Empty, error.Description);
            }
            else{
                return RedirectToPage("./Login");
            }

            return Page();
        }
    }
}
