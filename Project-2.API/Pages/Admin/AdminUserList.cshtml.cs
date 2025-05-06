using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using Project_2.API;
using Project_2.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Project_2.Pages.Pages.Admin
{
    [Authorize(Roles = "Admin")]
    class UserModel(
        ILogger<LayoutModel> logger, UserManager<User> userManager, UserController controller
        ) : LayoutModel(logger, userManager)
    {
        private readonly UserManager<User> _userManager = userManager;


        public async Task<IActionResult> OnGetAsync()
        {
            UserList = await _userManager.Users.ToListAsync();
            var admin = await _userManager.GetUserAsync(User);
            AdminGuid = admin?.Id ?? Guid.Empty;
            return Page();
        }

        [BindProperty]
        public List<User>? UserList { get; set; }
        [BindProperty]
        public bool isBanned {get; set;}
        public Guid AdminGuid {get; private set;}

        // public async Task<IActionResult> OnDeactivate(Guid id) {
        //     if (!UserList.Find(u => u.Id.Equals(id)).isDeactivated) {
        //         UserList.Find(u => u.Id.Equals(id)).isDeactivated = true;
        //     }
        //     else {
        //         UserList.Find(u => u.Id.Equals(id)).isDeactivated = false;
        //     }
        // }

        
        public async Task<IActionResult> OnPostBanAsync(Guid id)
        {
            User user = await _userManager.FindByIdAsync(id.ToString());

            await _userManager.SetLockoutEnabledAsync(user, true);
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);


            return RedirectToPage();
        }

        public async Task<IActionResult> OnPostUnBanAsync(Guid id)
        {
            User user = await _userManager.FindByIdAsync(id.ToString());
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);
            await _userManager.SetLockoutEnabledAsync(user, false);

            return RedirectToPage();
        }


        public async Task<IActionResult> OnPostDeleteAsync(Guid id)
        {
            User user = await _userManager.FindByIdAsync(id.ToString());
            await _userManager.DeleteAsync(user);
            return RedirectToPage();
        }
    }
}