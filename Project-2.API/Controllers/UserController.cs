using Project_2.Models;
using Project_2.Models.DTOs;
using Project_2.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Project_2.API;

// We need to designate this as an API Controller
// And we should probably set a top level route
// hint: If you use the [EntityName]Controller convention, we can essentially
// parameterize the route name
[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{

    private readonly IUserService _userService;
    private readonly UserManager<User> _userManager;

    public UserController(IUserService userService, UserManager<User> userManager)
    {
        _userService = userService;
        _userManager = userManager;
    }

    // Get: api/admin/user
    // Endpoint to retrieve all Users Admin Only
    [Authorize(Roles = "Admin")]
    [HttpGet("/api/admin/user")]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
    {
        try
        {
            return Ok(await _userManager.Users.ToListAsync());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Get: api/admin/user/id/{id}
    // Get user by id Admin Only
    [Authorize(Roles = "Admin")]
    [HttpGet("/api/admin/user/id/{id}")]
    public async Task<ActionResult<UserDTO>> GetUserByAdminId([FromRoute] Guid id)
    {
        try
        {
            return Ok(await _userService.GetUserByIdAsync(id));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Delete: api/admin/user/id/{id}
    // Delete user by id Admin Only
    [Authorize(Roles = "Admin")]
    [HttpDelete("/api/admin/user/id/{id}")]
    public async Task<ActionResult<bool>> DeleteUserById([FromRoute] Guid id){
        try{
            await _userService.DeleteUserByIdAsync(id);
            return Ok(true);
        } catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    // Get: api/user
    // Get user profile owner only
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDTO>> GetUserById()
    {
        try
        {
            User? user = await GetCurrentUserAsync();
            return Ok(await _userService.GetUserByIdAsync(user?.Id));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        return await _userManager.GetUserAsync(HttpContext.User);
    }

}