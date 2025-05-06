using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Project_2.Models;
using Project_2.API;
using Microsoft.AspNetCore.Identity;
using Project_2.Services.Services;

namespace Project_2.Pages
{
    public class IndexModel : LayoutModel
    {
        private const int PageSize = 5;
        private readonly IPropertyService _propertyService;

        public IndexModel(ILogger<IndexModel> log,
                          UserManager<User> userManager,
                          IPropertyService propertyService)
          : base(log, userManager)
        {
            _propertyService = propertyService;
            Properties = new List<Property>();
            States = new HashSet<string>();
        }


        [BindProperty(SupportsGet = true)]
        public int Page { get; set; } = 1; //changed by frontend button

        public IList<Property> Properties { get; set; }
        public ISet<string> States { get; set; }
        public IEnumerable<Property> Paged { get; set; }
        public int TotalPages { get; set; }

        public async Task<IActionResult> OnRetrieveAsync(Guid id) {
            return RedirectToPage($"./EstateProperties/Retrieve/{id}");
        }

        public async Task OnGetAsync()
        {
            var all = (await _propertyService.GetPropertiesAsync("", "", "", "", "", -1, -1, -1, -1, false, null))
                      .ToList();

            Properties = all;
            States = all.Where(p => !string.IsNullOrEmpty(p.State))
                          .Select(p => p.State!)
                          .Distinct()
                          .ToHashSet();


            TotalPages = (int)Math.Ceiling(all.Count / (double)PageSize); //total number of pages if we where to check ALL properties for real
            Page = Math.Clamp(Page, 1, TotalPages);

            Paged = all
                .Skip((Page - 1) * PageSize) // gets the page we want 
                .Take(PageSize);
        }
    }
}