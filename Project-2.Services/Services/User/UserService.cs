using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_config.GetValue<double>("Jwt:ExpireDays")),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<List<User>> GetAllUsersAsync() {
        return await _userManager.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid? userId) {
        return await _userManager.FindByIdAsync(userId.ToString()!);
    }

    public async Task<User> GetLoggedInUserAsync(ClaimsPrincipal user) {
        return (await _userManager.GetUserAsync(user))!;
    }

    public async Task DeleteUserByIdAsync(Guid? userId) {
        User? userToDelete = await _userManager.FindByIdAsync(userId.ToString()!);
        if (userToDelete is null) {
            throw new Exception("User not found");
        }

        IdentityResult result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded) {
            throw new Exception("Failed to delete user");
        }
    }
}