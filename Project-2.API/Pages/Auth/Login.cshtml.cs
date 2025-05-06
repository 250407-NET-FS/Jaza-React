using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Services;
using Project_2.Models;
using Microsoft.AspNetCore.Identity;

namespace Project_2.Pages.Pages.Auth
{
    [BindProperties]
    public class LoginModel : LayoutModel
    {
        private readonly ILogger<LoginModel> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IUserService _userService;
        private readonly SignInManager<User> _signInManager;


        public LoginModel(
            SignInManager<User> signInManager,
            IUserService userService,
            ILogger<LoginModel> logger,
            ILogger<LayoutModel> layoutLogger,
            UserManager<User> userManager)
            : base(layoutLogger, userManager)
        {
            _logger = logger;
            _userManager = userManager;
            _userService = userService;
            _signInManager = signInManager;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        // PageModel has its own User object idependent of the model layer
        public LoginDto? UserInfo { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            //If the LoginDto doesnt conform to our model binding rules, just kick it back
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            //Reach into the db and find the User with this email
            var user = await _userManager.FindByEmailAsync(UserInfo.Email);

            //If we do not succeed...
            if (user == null || !await _userManager.CheckPasswordAsync(user, UserInfo.Password))
            {
                TempData["ErrorMessage"] = "Invalid email or password.";
                return Page();
            }

            

            var token = await _userService.GenerateToken(user);

            Response.Cookies.Append
            (
                "jwt",
                token,
                new CookieOptions
                {
                    Path     = "/",     
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddHours(1)
                }
            );
            
            TempData["SuccessMessage"] = "Login successful! Redirecting to home in 3 seconds…";

            return RedirectToPage("../Index");
        }
    }
}
