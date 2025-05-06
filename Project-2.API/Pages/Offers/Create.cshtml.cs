using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Pages.Offers {
    [BindProperties]
    public class CreateModel(ILogger<LayoutModel> logger, UserManager<User> manager,
        OfferController controller
    ): LayoutModel(logger, manager) {
        private readonly OfferController _controller = controller;

        public IActionResult OnGet() {
            return Page();
        }

        public Offer? Offer {get; set;}

        public async Task<IActionResult> OnPostAsync(OfferNewDTO dto) {
            await _controller.CreateOffer(dto);
            return RedirectToPage("./Index");
        }
    }
}