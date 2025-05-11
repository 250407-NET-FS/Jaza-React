using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using Project_2.Models;

namespace Project_2.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public UserService(UserManager<User> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    public async Task<string> GenerateToken(User user)
    {
        List<Claim> claims = new List<Claim> {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!)
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt Key not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(Double.Parse(_config["Jwt:ExpirationInMinutes"]!)),
            SigningCredentials = creds,
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"]
        };

        return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _userManager.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid? userId)
    {
        return await _userManager.FindByIdAsync(userId.ToString()!);
    }

    public async Task<User> GetLoggedInUserAsync(ClaimsPrincipal user)
    {
        return (await _userManager.GetUserAsync(user))!;
    }

    public async Task DeleteUserByIdAsync(Guid? userId)
    {
        User? userToDelete = await _userManager.FindByIdAsync(userId.ToString()!);
        if (userToDelete is null)
        {
            throw new Exception("User not found");
        }

        IdentityResult result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded)
        {
            throw new Exception("Failed to delete user");
        }
    }
}