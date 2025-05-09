using Project_2.Models;
using Project_2.Services;
using Microsoft.AspNetCore.Identity;

using Microsoft.AspNetCore.Mvc;

namespace Project_2.API;

// We need to designate this as an API Controller
// And we should probably set a top level route
// hint: If you use the [EntityName]Controller convention, we can essentially
// parameterize the route name
[ApiController]
[Route("api/auth")]
public class AuthUserController : ControllerBase{
    private readonly UserManager<User> _userManager;
    private readonly IUserService _userService;
   
    public AuthUserController(UserManager<User> userManager, IUserService userService)
    {
        _userManager = userManager;
        _userService = userService;

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto newUser)
    {
        //If the LoginDto doesnt conform to our model binding rules, just kick it back
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        //Using the DTO's info to construct a new User model object to stick
        //into the database
        var user = new User
        {
            UserName = newUser.Email,
            Email = newUser.Email,
            FullName = newUser.FullName!
        };

        //We are going to attempt to add the user to the db, if they are added we will return
        //an Ok with a success message
        //If not, we return some error
        var result = await _userManager.CreateAsync(user, newUser.Password!);

        // result above is of type IdentityResult
        // It contains info about an AspNetCore.Identity related database operation
        //In this case, did we succeed in creating a new user record on our database
        //If not, we run the code below. If we did succeed, we just return the Ok with a message.
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { message = "Registration Successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto existingUser)
    {
        //If the LoginDto doesnt conform to our model binding rules, just kick it back
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        //Reach into the db and find the User with this email
        var user = await _userManager.FindByEmailAsync(existingUser.Email!);

        //If we do not succeed...
        if (user == null || !await _userManager.CheckPasswordAsync(user, existingUser.Password!))
        {
            return Unauthorized("invalid Credentials");
        }

        var token = await _userService.GenerateToken(user);

        return Ok(new { token });
    }
}