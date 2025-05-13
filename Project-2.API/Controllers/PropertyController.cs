using Project_2.Models;
using Project_2.Models.DTOs;
using Project_2.Services.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Project_2.API;

// We need to designate this as an API Controller
// And we should probably set a top level route
// hint: If you use the [EntityName]Controller convention, we can essentially
// parameterize the route name
[ApiController]
[Route("api/properties")]
public class PropertyController : ControllerBase{

    private readonly IPropertyService _propertyService;
    private readonly UserManager<User> _userManager;

    public PropertyController(IPropertyService propertyService, UserManager<User> userManager)
    {
        _propertyService = propertyService;
        _userManager = userManager;
    }

    // Get: api/properties
    // Endpoint to retrieve all Properties
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyResponseDTO>>> GetAllProperties(
        [FromQuery] string country = "",
        [FromQuery] string state = "",
        [FromQuery] string city = "",
        [FromQuery] string zip = "",
        [FromQuery] string address = "",
        [FromQuery] string imageLink = "",
        [FromQuery] decimal minprice = -1,
        [FromQuery] decimal maxprice = -1,
        [FromQuery] int bedrooms = -1,
        [FromQuery] decimal bathrooms = -1,
        [FromQuery] int garages = -1,
        [FromQuery] int pools = -1,
        [FromQuery] bool forsale = false,
        [FromQuery] bool hasBasement = false,
        [FromQuery] Guid? OwnerID = null
        ){
        try
        {
            return Ok(
                await _propertyService.GetPropertiesAsync(
                    country, state, city, zip, address, imageLink, minprice, maxprice, 
                    bedrooms, bathrooms, garages, pools, forsale, hasBasement, OwnerID
                )
            );
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Get: api/properties/distance/{id}
    // Endpoint to retrieve all Properties
    [HttpGet("distance/{propertyId}")]
    public async Task<ActionResult<IEnumerable<PropertyResponseDTO>>> GetAllPropertiesWithinDistOf([FromRoute] Guid propertyId, [FromQuery] int meters = 500) {
        try
        {
            return Ok(
                await _propertyService.GetPropertiesWithinDistOfAsync(propertyId, meters)
            );
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Get: api/admin/properties
    // Get all properties Admin Only
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<PropertyResponseDTO>>> GetAllPropertiesAdmin(){
        try{
            return Ok(
                await _propertyService.GetPropertiesAdminAsync()
            );
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    //Post: api/properties
    //Create a new property
    [Authorize]
    [HttpPost] // In this method, we explicity tell ASP to look for our dto in the body of the request
    public async Task<ActionResult<Guid>> CreateProperty([FromBody] PropertyAddDTO dto)
    {
        try
        {
            //Explicitly checking the modelstate to make sure that out dto conforms
            //to whatever we need it to be
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            Guid newPropertyID = await _propertyService.AddNewPropertyAsync(dto);
            return Ok(newPropertyID);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Put: api/properties
    // Updates property attributes based on what is not null owner only
    [Authorize]
    [HttpPut]
    public async Task<ActionResult> UpdateProperty([FromBody] PropertyUpdateDTO dto){
        try{
            User? user = await GetCurrentUserAsync();
            await _propertyService.UpdatePropertyAsync(dto, user!.Id);
            return Ok();
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Delete: api/property/{id}
    // Deletes property by property id owner only
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProperty([FromRoute] Guid id){
        try{
            User? user = await GetCurrentUserAsync();
            await _propertyService.RemovePropertyAsync(id, user!.Id);
            return Ok();
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Delete: api/admin/properties/{id}
    // Deletes property by property id admin only
    [Authorize(Roles = "Admin")]
    [HttpDelete("admin/{propertyID}/{ownerID}")]
    public async Task<IActionResult> DeletePropertyAdmin([FromRoute] Guid propertyID, [FromRoute] Guid ownerID){
        try{
            await _propertyService.RemovePropertyAsync(propertyID, ownerID);
            return Ok();
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Get: api/properties/id/{id}
    // Get property by id
    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyResponseDTO>> GetPropertyById([FromRoute] Guid id){
        try{
            return Ok(await _propertyService.GetPropertyByIdAsync(id));
        } catch (Exception e){
            return BadRequest(e.Message);
        }
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        return await _userManager.GetUserAsync(HttpContext.User);
    }

}