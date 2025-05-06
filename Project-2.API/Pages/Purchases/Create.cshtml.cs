using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.API;
using Project_2.Models;
using Project_2.Models.DTOs;

namespace Project_2.Pages.Purchases {
    [BindProperties]
    public class CreateModel(ILogger<LayoutModel> logger, UserManager<User> manager, PurchaseController controller): LayoutModel(logger, manager) {
        private readonly PurchaseController _controller;


        public IActionResult OnGet() {
            return Page();
        }

        public Purchase? Purchase {get; set;}

        public async Task<IActionResult> OnPostAsync(CreatePurchaseDTO dto) {
            await _controller.AcceptOffer(dto);
            return RedirectToPage("./Index");
        }
    }
}