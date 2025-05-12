using Project_2.Models;
using Project_2.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Project_2.Models.DTOs;

namespace Project_2.API;

// We need to designate this as an API Controller
// And we should probably set a top level route
// hint: If you use the [EntityName]Controller convention, we can essentially
// parameterize the route name
[ApiController]
[Route("api/offer")]
public class OfferController : ControllerBase{

    private readonly IOfferService _offerService;

    public OfferController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    // Get: api/offer
    // Endpoint to retrieve all Offers
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Offer>>> GetAllOffers(){
        try
        {
            return Ok(await _offerService.GetAllAsync());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //POST: api/offer
    //Create a new offer
    [Authorize]
    [HttpPost] // In this method, we explicity tell ASP to look for our dto in the body of the request
    public async Task<ActionResult<OfferResponseDTO>> CreateOffer([FromBody] OfferNewDTO dto)
    {
        try
        {
            //Explicitly checking the modelstate to make sure that out dto conforms
            //to whatever we need it to be
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return Ok(await _offerService.AddAsync(dto));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Get: api/offer/id/{id}
    // Get offer by id
    [Authorize]
    [HttpGet("id/{id}")]
    public async Task<ActionResult<Offer>> GetOfferById([FromRoute] Guid id){
        try{
            return Ok(await _offerService.GetByIdAsync(id));
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Get: api/offer/user/{id}
    // Get all offer from user
    [Authorize]
    [HttpGet("user/{id}")]
    public async Task<ActionResult<IEnumerable<OfferResponseDTO>>> GetAllOffersFromUser([FromRoute] Guid id){
        try{
            return Ok(await _offerService.GetAllByUserAsync(id));
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Get: api/offer/property/{id}
    // Get all offers for property
    [Authorize]
    [HttpGet("property/{id}")]
    public async Task<ActionResult<IEnumerable<Property>>> GetAllOffersForProperty([FromRoute] Guid id){
        try{
            return Ok(await _offerService.GetAllForPropertyAsync(id));
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }


}