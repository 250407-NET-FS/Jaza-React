using System.Security.Claims;
using Project_2.Models;

namespace Project_2.Services;

public interface IUserService{
    Task<string> GenerateToken(User user);
    Task<List<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(Guid? userId);
    Task<User> GetLoggedInUserAsync(ClaimsPrincipal user);
    Task DeleteUserByIdAsync(Guid? userId);
}