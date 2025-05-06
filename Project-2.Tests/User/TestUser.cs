using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Project_2.Models;
using Project_2.Services;
using Xunit;

namespace Project_2.Tests;

// test
// generate a token
// get user by id
// check user logged in
// delete user
// delete user invalid id
// delete user fails should throw exception
public class UserServiceTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        // Setup UserManager mock
        _mockUserManager = new Mock<UserManager<User>>(
            // options passwordhash uservalid passwordvalid keynorm error service logger
            Mock.Of<IUserStore<User>>(), null, null, null, null, null, null, null, null);

        // Setup Configuration mock
        _mockConfig = new Mock<IConfiguration>();
        _mockConfig.Setup(c => c["Jwt:Key"]).Returns("your-256-bit-secret-key-here");
        _mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("test-issuer");
        _mockConfig.Setup(c => c["Jwt:Audience"]).Returns("test-audience");

        _userService = new UserService(_mockUserManager.Object, _mockConfig.Object);
    }

    //test token generation
    [Fact]
    public async Task GenerateToken_ShouldReturnValidJwtToken()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "testuser",
            Email = "test@test.com"
        };

        var roles = new List<string> { "User" };
        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(roles);

        var token = await _userService.GenerateToken(user);

        Assert.NotNull(token);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        Assert.Equal(user.UserName, jwtToken.Claims.First(c => c.Type == ClaimTypes.Name).Value);
        Assert.Equal(user.Id.ToString(), jwtToken.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal(user.Email, jwtToken.Claims.First(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal(roles[0], jwtToken.Claims.First(c => c.Type == ClaimTypes.Role).Value);
    }

    //test get all users
    // [Fact]
    // public async Task GetAllUsersAsync_ShouldReturnAllUsers()
    // {

    //     var users = new List<User>
    //     {
    //         new User { Id = Guid.NewGuid(), UserName = "user1", Email = "user1@test.com" },
    //         new User { Id = Guid.NewGuid(), UserName = "user2", Email = "user2@test.com" }
    //     }.AsQueryable();

    //     var mockDbSet = new Mock<DbSet<User>>();
    //     mockDbSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
    //     mockDbSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
    //     mockDbSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
    //     mockDbSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());

    //     _mockUserManager.Setup(x => x.Users).Returns(mockDbSet.Object);

    //     var result = await _userService.GetAllUsersAsync();
    //     Assert.NotNull(result);
    //     Assert.Equal(2, result.Count);
    // }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnUser()
    {
        var userId = Guid.NewGuid();
        var expectedUser = new User { Id = userId, UserName = "testuser" };

        _mockUserManager.Setup(x => x.FindByIdAsync(userId.ToString()))
            .ReturnsAsync(expectedUser);

        var result = await _userService.GetUserByIdAsync(userId);

        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
    }

    [Fact]
    public async Task GetLoggedInUserAsync_ShouldReturnUser()
    {
        var user = new User { Id = Guid.NewGuid(), UserName = "testuser" };
        var claimsPrincipal = new ClaimsPrincipal();

        _mockUserManager.Setup(x => x.GetUserAsync(claimsPrincipal))
            .ReturnsAsync(user);

        var result = await _userService.GetLoggedInUserAsync(claimsPrincipal);

        Assert.NotNull(result);
        Assert.Equal(user.Id, result.Id);
    }

    [Fact]
    public async Task DeleteUserByIdAsync_ShouldDeleteUser()
    {
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, UserName = "testuser" };

        _mockUserManager.Setup(x => x.FindByIdAsync(userId.ToString()))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.DeleteAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        await _userService.DeleteUserByIdAsync(userId);

        _mockUserManager.Verify(x => x.DeleteAsync(user), Times.Once);
    }

    [Fact]
    public async Task DeleteUserByIdAsync_WhenUserNotFound_ShouldThrowException()
    {
        var userId = Guid.NewGuid();
        _mockUserManager.Setup(x => x.FindByIdAsync(userId.ToString()))
            .ReturnsAsync((User?)null);

        var exception = await Assert.ThrowsAsync<Exception>(
            () => _userService.DeleteUserByIdAsync(userId));
        Assert.Equal("User not found", exception.Message);
    }

    [Fact]
    public async Task DeleteUserByIdAsync_WhenDeleteFails_ShouldThrowException()
    {

        var userId = Guid.NewGuid();
        var user = new User { Id = userId, UserName = "testuser" };

        _mockUserManager.Setup(x => x.FindByIdAsync(userId.ToString()))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.DeleteAsync(user))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Delete failed" }));


        var exception = await Assert.ThrowsAsync<Exception>(
            () => _userService.DeleteUserByIdAsync(userId));
        Assert.Equal("Failed to delete user", exception.Message);
    }
}