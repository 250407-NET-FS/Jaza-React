using Project_2.Models;
using Project_2.Services.Services;

using Microsoft.AspNetCore.Mvc;
using Project_2.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Project_2.API;

// We need to designate this as an API Controller
// And we should probably set a top level route
// hint: If you use the [EntityName]Controller convention, we can essentially
// parameterize the route name
[ApiController]
[Authorize]
[Route("api/favorites")]
public class FavoriteController : ControllerBase
{

    private readonly UserManager<User> _userManager;
    private readonly IFavoriteService _favoriteService;

    public FavoriteController(UserManager<User> userManager, IFavoriteService favoriteService)
    {
        _userManager = userManager;
        _favoriteService = favoriteService;
    }

    // Get: api/favorites
    // Endpoint to retrieve all Favorites by the current user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Favorite>>> GetAllFavorites()
    {
        try
        {
            return Ok(await _favoriteService.GetAllByUserAsync(Guid.Parse(_userManager.GetUserId(this.User)!)));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Get: api/favorites/{propertyId}
    [HttpGet("{propertyId}")]
    public async Task<ActionResult<IEnumerable<Favorite>>> CheckIfFavorited(Guid propertyId)
    {
        try
        {
            string? currentUserId = _userManager.GetUserId(this.User);
            FavoritesDTO dto = new FavoritesDTO() { PropertyId = propertyId };
            return Ok(await _favoriteService.GetAllFavoritesAsync());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //POST: api/favorites
    //Create a new favorite
    [HttpPost] // In this method, we explicity tell ASP to look for our dto in the body of the request
    public async Task<ActionResult<FavoritesDTO>> MarkUnmarkFavorite([FromBody] FavoritesDTO dto)
    {
        try
        {
            //Explicitly checking the modelstate to make sure that out dto conforms
            //to whatever we need it to be
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _favoriteService.MarkUnmarkFavoriteAsync(dto);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    //get api/favorites/top-favorites
    [AllowAnonymous]
    [HttpGet("top-favorites")]
    public async Task<ActionResult<IEnumerable<Property>>> GetTopFavorited([FromQuery] int count = 7)
    {
        try
        {
            var properties = await _favoriteService.GetTopFavoritedPropertiesAsync(count);
            Console.WriteLine($"Retrieved {properties.Count()} properties");

            if (!properties.Any())
            {
                Console.WriteLine("No properties found");
                return Ok(Array.Empty<Property>());
            }

            var firstProperty = properties.First();
            Console.WriteLine($"First property: ID={firstProperty.PropertyID}, Address={firstProperty.StreetAddress}");

            return Ok(properties);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error in GetTopFavorited: {e.Message}");
            return BadRequest(e.Message);
        }
    }
    //front end test endpoint to check connection
    [AllowAnonymous]
    [HttpGet("health")]
    public ActionResult CheckHealth()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}