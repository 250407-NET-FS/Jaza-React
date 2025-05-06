using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Models;
using Project_2.Models.DTOs;
using Project_2.Services.Services;

namespace Project_2.Pages.Pages.EstateProperties {
    [BindProperties]
    public class RetrieveModel(
            ILogger<LayoutModel> logger,
            UserManager<User> manager,
            PropertyService propertyService,
            FavoriteController favoriteController
            ): LayoutModel(logger, manager) {

        private readonly FavoriteController _favoriteController = favoriteController;
        private readonly ILogger<LayoutModel> _logger = logger;

        private readonly UserManager<User> _userManager = manager;
         private readonly PropertyService _propertyService = propertyService;
        

        public async Task<IActionResult> OnGet(Guid id) {
            Property = await _propertyService.GetPropertyByIdAsync(id);


            User = await manager.FindByIdAsync(Property.OwnerID.ToString()) ?? throw new Exception($"No user with ID {Property.OwnerID}");


            DaysListed = DateTime.Now.Subtract(Property!.ListDate).Days;
            return Page();
        }

        public Property? Property {get; set;}
        public new User? User {get; set;}
        public FavoritesDTO? BookmarkInfo {get; set;}
        public bool IsSaved {get; set;}
        public int DaysListed {get; set;}

        public async Task<IActionResult> BookmarkAsync(FavoritesDTO dto) {
            if (IsSaved) {
                await _favoriteController.MarkUnmarkFavorite(dto);
                IsSaved = false;
            }
            else {
                await _favoriteController.MarkUnmarkFavorite(dto);
                IsSaved = true;
            }

            return RedirectToPage();
        }
    }
}