using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;
using Project_2.Models;
using Project_2.Services;
using Project_2.Data;
using Project_2.Models.DTOs;
using Project_2.Services.Services;

// test
// get all favorites
// add favorites
// remove favorites
// check favorites
// get all user favorites
// get all user favorites no user found throws exception
// when property not found throw exception

namespace Project_2.Tests
{
    public class TestFavorite
    {
        private readonly Mock<IFavoriteRepository> _favoriteRepositoryMock;
        private readonly Mock<IPropertyRepository> _propertyRepositoryMock;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly FavoriteService _favoriteService;

        public TestFavorite()
        {
            _favoriteRepositoryMock = new Mock<IFavoriteRepository>();
            _propertyRepositoryMock = new Mock<IPropertyRepository>();

            // fix/added UserManager mock setup
            var store = Mock.Of<IUserStore<User>>();
            var options = Mock.Of<IOptions<IdentityOptions>>();
            var passwordHasher = Mock.Of<IPasswordHasher<User>>();
            var userValidators = Array.Empty<IUserValidator<User>>();
            var passwordValidators = Array.Empty<IPasswordValidator<User>>();
            var keyNormalizer = Mock.Of<ILookupNormalizer>();
            var errors = new IdentityErrorDescriber();
            var services = Mock.Of<IServiceProvider>();
            var logger = Mock.Of<ILogger<UserManager<User>>>();

            _userManagerMock = new Mock<UserManager<User>>(
                store, options, passwordHasher, userValidators,
                passwordValidators, keyNormalizer, errors, services, logger);

            _favoriteService = new FavoriteService(
                _favoriteRepositoryMock.Object,
                _propertyRepositoryMock.Object,
                _userManagerMock.Object
            );
        }

        // Test for AddAsync method with valid data
        // [Fact]
        // public async Task AddAsync_ShouldAddFa_AndHandleErrors()
        // {
        //     // Arrange valid data
        //     FavoritesDTO favoriteDto = new FavoritesDTO
        //     {
        //         PropertyId = Guid.NewGuid(),
        //         UserId = Guid.NewGuid()
        //     };

        //     Property property = new Property("CountryName", "StateName", "CityName", "StreetName", "ZipCode", 1000.0m, 3, 500.0m)
        //     {
        //         PropertyID = favoriteDto.PropertyId
        //     };
        //     // Important: IdentityUser expects string ID, so use .ToString()
        //     User user = new User
        //     {
        //         Id = favoriteDto.UserId,
        //         UserName = "TestUser",
        //         Email = "testuser@example.com"
        //     };

        //     _propertyRepositoryMock.Setup(x => x.GetByIdAsync(favoriteDto.PropertyId)).ReturnsAsync(property);
        //     _userManagerMock.Setup(x => x.FindByIdAsync(favoriteDto.UserId.ToString())).ReturnsAsync(user);

        //     _favoriteRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Favorite>())).Returns(Task.CompletedTask);
        //     _favoriteRepositoryMock.Setup(x => x.SaveChangesAsync()).Returns(Task.FromResult(1));

        //     // Act & Assert for valid data
        //     var result = await _favoriteService.AddAsync(favoriteDto);
        //     Assert.NotNull(result);
        //     Assert.Equal(favoriteDto.PropertyId, result.PropertyId);
        //     Assert.Equal(favoriteDto.UserId, result.UserId);

        //     // Test for property not found
        //     _propertyRepositoryMock.Setup(x => x.GetByIdAsync(favoriteDto.PropertyId)).ReturnsAsync((Property)null);
        //     var exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.AddAsync(favoriteDto));
        //     Assert.Equal("Property cannot be null", exception.Message);

        //     // Test for user not found
        //     _propertyRepositoryMock.Setup(x => x.GetByIdAsync(favoriteDto.PropertyId)).ReturnsAsync(property);
        //     _userManagerMock.Setup(x => x.FindByIdAsync(favoriteDto.UserId.ToString())).ReturnsAsync((User)null);
        //     exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.AddAsync(favoriteDto));
        //     Assert.Equal("User cannot be null", exception.Message);
        // }

        // Test for RemoveAsync method
        // [Fact]
        // public async Task RemoveAsync_ShouldRemoveFavorite_AndHandleErrors()
        // {
        //     // Arrange
        //     Guid favoriteId = Guid.NewGuid();
        //     Favorite favorite = new Favorite(Guid.NewGuid(), Guid.NewGuid()) { FavoriteID = favoriteId };

        //     _favoriteRepositoryMock.Setup(x => x.GetByIdAsync(favoriteId)).ReturnsAsync(favorite);
        //     _favoriteRepositoryMock.Setup(x => x.Remove(It.IsAny<Favorite>()));

        //     // Act & Assert for valid data
        //     await _favoriteService.RemoveAsync(favoriteId);

        //     // Assert Remove method is called
        //     _favoriteRepositoryMock.Verify(x => x.Remove(It.IsAny<Favorite>()), Times.Once);

        //     // Test for Favorite not found
        //     _favoriteRepositoryMock.Setup(x => x.GetByIdAsync(favoriteId)).ReturnsAsync((Favorite)null);
        //     var exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.RemoveAsync(favoriteId));
        //     Assert.Equal("Favorite not found", exception.Message);
        // }

        // // Test for GetByIdAsync method
        // [Fact]
        // public async Task GetByIdAsync_ShouldReturnFavorite_AndHandleErrors()
        // {
        //     // Arrange
        //     Guid favoriteId = Guid.NewGuid();
        //     Favorite favorite = new Favorite(Guid.NewGuid(), Guid.NewGuid()) { FavoriteID = favoriteId };

        //     _favoriteRepositoryMock.Setup(x => x.GetByIdAsync(favoriteId)).ReturnsAsync(favorite);

        //     // Act & Assert for valid data
        //     var result = await _favoriteService.GetByIdAsync(favoriteId);
        //     Assert.NotNull(result);
        //     Assert.Equal(favoriteId, result.FavoriteId);

        //     // Test for favorite not found
        //     _favoriteRepositoryMock.Setup(x => x.GetByIdAsync(favoriteId)).ReturnsAsync((Favorite)null);
        //     var exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.GetByIdAsync(favoriteId));
        //     Assert.Equal("Favorite not found", exception.Message);
        // }

        // // Test for GetAllForProperty method
        // [Fact]
        // public async Task GetAllForProperty_ShouldReturnFavorites_AndHandleErrors()
        // {
        //     // Arrange
        //     Guid propertyId = Guid.NewGuid();
        //     List<Favorite> favorites = new List<Favorite>
        //     {
        //         new Favorite(Guid.NewGuid(), Guid.NewGuid()),
        //         new Favorite(Guid.NewGuid(), Guid.NewGuid())
        //     };

        //     _propertyRepositoryMock.Setup(x => x.GetByIdAsync(propertyId)).ReturnsAsync(new Property("CountryName", "StateName", "CityName", "StreetName", "ZipCode", 1000.0m, 3, 500.0m) { PropertyID = propertyId });
        //     _favoriteRepositoryMock.Setup(x => x.GetAllForProperty(propertyId)).ReturnsAsync(favorites);

        //     // Act & Assert for valid data
        //     var result = await _favoriteService.GetAllForProperty(propertyId);
        //     Assert.NotNull(result);
        //     Assert.Equal(2, result.Count());

        //     // Test for property not found
        //     _propertyRepositoryMock.Setup(x => x.GetByIdAsync(propertyId)).ReturnsAsync((Property)null);
        //     var exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.GetAllForProperty(propertyId));
        //     Assert.Equal("Property does not exist", exception.Message);
        // }
        // split into 2 test, GetAllByUserAsync_ShouldReturnFavorites() and GetAllByUserAsync_WhenUserNotFound_ShouldThrowException
        // [Fact]
        // public async Task GetAllByUserAsync_ShouldReturnFavoritesAndHandleErrors()
        // {
        //     Guid userId = Guid.NewGuid();
        //     List<Favorite> favorites = new List<Favorite>
        //     {
        //         new Favorite(Guid.NewGuid(), userId),
        //         new Favorite(Guid.NewGuid(), userId)
        //     };

        //     _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString()))
        //         .ReturnsAsync(new User
        //         {
        //             Id = userId,
        //             UserName = "TestUser",
        //             Email = "testuser@example.com"
        //         });
        //     _favoriteRepositoryMock.Setup(x => x.GetAllByUser(userId)).ReturnsAsync(favorites);

        //     var result = await _favoriteService.GetAllByUserAsync(userId);

        //     Assert.NotNull(result);
        //     Assert.Equal(2, result.Count());

        //     // Test for user not found
        //     _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString())).ReturnsAsync((User)null);
        //     var exception = await Assert.ThrowsAsync<Exception>(() => _favoriteService.GetAllByUserAsync(userId));
        //     Assert.Equal("User does not exist.", exception.Message);
        // }

        [Fact]
        public async Task GetAllFavoritesAsync_ShouldReturnAllFavorites()
        {
            var favorites = new List<Favorite>
            {
                new(Guid.NewGuid(), Guid.NewGuid()),
                new(Guid.NewGuid(), Guid.NewGuid())
            };

            _favoriteRepositoryMock.Setup(x => x.GetAllAsync())
                .ReturnsAsync(favorites);

            var result = await _favoriteService.GetAllFavoritesAsync();

            Assert.NotNull(result);
            Assert.Equal(favorites.Count, result.Count());
        }

        [Fact]
        public async Task MarkUnmarkFavoriteAsync_ShouldToggleFavorite()
        {
            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            var property = SharedObjects.CloneValidProperty1();
            var user = new User { Id = dto.UserId };

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(dto.PropertyId))
                .ReturnsAsync(property);
            _userManagerMock.Setup(x => x.FindByIdAsync(dto.UserId.ToString()))
                .ReturnsAsync(user);

            // Test Adding Favorite
            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(new List<Favorite>());

            await _favoriteService.MarkUnmarkFavoriteAsync(dto);
            _favoriteRepositoryMock.Verify(x => x.AddAsync(It.Is<Favorite>(f =>
                f.PropertyID == dto.PropertyId && f.UserID == dto.UserId)), Times.Once);

            // Test Removing Favorite
            var existingFavorite = new Favorite(dto.PropertyId, dto.UserId);
            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(new List<Favorite> { existingFavorite });

            await _favoriteService.MarkUnmarkFavoriteAsync(dto);
            _favoriteRepositoryMock.Verify(x => x.Remove(It.Is<Favorite>(f =>
                f.PropertyID == dto.PropertyId && f.UserID == dto.UserId)), Times.Once);
        }

        [Fact]
        public async Task CheckFavoritedAsync_ShouldReturnCorrectState()
        {
            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            var getDto = new FavoritesGetDTO
            {
                PropertyId = dto.PropertyId,
                UserId = dto.UserId
            };

            var favorites = new List<Favorite>
            {
                new(dto.PropertyId, dto.UserId)
            };

            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(favorites);


            var result = await _favoriteService.CheckFavoritedAsync(getDto);

            Assert.True(result);
        }

        [Fact]
        public async Task GetAllByUserAsync_ShouldReturnFavorites()
        {
            var userId = Guid.NewGuid();
            var favorites = new List<Favorite>
            {
                new(Guid.NewGuid(), userId),
                new(Guid.NewGuid(), userId)
            };

            var user = new User
            {
                Id = userId,
                UserName = "TestUser",
                Email = "testuser@example.com"
            };

            _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString()))
                .ReturnsAsync(user);
            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(userId))
                .ReturnsAsync(favorites);


            var result = await _favoriteService.GetAllByUserAsync(userId);


            Assert.NotNull(result);
            Assert.Equal(favorites.Count, result.Count());
        }

        [Fact]
        public async Task GetAllByUserAsync_WhenUserNotFound_ShouldThrowException()
        {
            var userId = Guid.NewGuid();
            _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString()))
                .ReturnsAsync((User)null);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _favoriteService.GetAllByUserAsync(userId));
            Assert.Equal("User does not exist", exception.Message);
        }

        [Fact]
        public async Task MarkUnmarkFavoriteAsync_ShouldAddNewFavorite()
        {
            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            SetupUserAndPropertyMocks(dto);
            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(new List<Favorite>());
            _favoriteRepositoryMock.Setup(x => x.SaveChangesAsync())
                .ReturnsAsync(1);

            await _favoriteService.MarkUnmarkFavoriteAsync(dto);

            _favoriteRepositoryMock.Verify(x => x.AddAsync(It.Is<Favorite>(f =>
                f.PropertyID == dto.PropertyId && f.UserID == dto.UserId)), Times.Once);
            _favoriteRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task MarkUnmarkFavoriteAsync_ShouldRemoveExistingFavorite()
        {

            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            SetupUserAndPropertyMocks(dto);
            var existingFavorite = new Favorite(dto.PropertyId, dto.UserId);
            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(new List<Favorite> { existingFavorite });
            _favoriteRepositoryMock.Setup(x => x.SaveChangesAsync())
                .ReturnsAsync(1);


            await _favoriteService.MarkUnmarkFavoriteAsync(dto);


            _favoriteRepositoryMock.Verify(x => x.Remove(It.Is<Favorite>(f =>
                f.PropertyID == dto.PropertyId && f.UserID == dto.UserId)), Times.Once);
            _favoriteRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task MarkUnmarkFavoriteAsync_WhenPropertyNotFound_ShouldThrowException()
        {

            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(dto.PropertyId))
                .ReturnsAsync((Property)null);


            var exception = await Assert.ThrowsAsync<Exception>(
                () => _favoriteService.MarkUnmarkFavoriteAsync(dto));
            Assert.Equal("Property cannot be null", exception.Message);
        }

        [Fact]
        public async Task CheckFavoritedAsync_WhenFavorited_ShouldReturnTrue()
        {

            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };

            var favorites = new List<Favorite>
            {
                new(dto.PropertyId, dto.UserId)
            };

            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(favorites);


            var getDto = new FavoritesGetDTO { PropertyId = dto.PropertyId, UserId = dto.UserId };
            var result = await _favoriteService.CheckFavoritedAsync(getDto);


            Assert.True(result);
        }

        [Fact]
        public async Task CheckFavoritedAsync_WhenNotFavorited_ShouldReturnFalse()
        {
            var dto = new FavoritesDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid()
            };


            _favoriteRepositoryMock.Setup(x => x.GetAllByUser(dto.UserId))
                .ReturnsAsync(new List<Favorite>());

            var getDto = new FavoritesGetDTO { PropertyId = dto.PropertyId, UserId = dto.UserId };
            var result = await _favoriteService.CheckFavoritedAsync(getDto);

            Assert.False(result);
        }

        private void SetupUserAndPropertyMocks(FavoritesDTO dto)
        {
            var property = SharedObjects.CloneValidProperty1();
            property.PropertyID = dto.PropertyId;
            property.OwnerID = dto.UserId;
            var user = new User { Id = dto.UserId };

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(dto.PropertyId))
                .ReturnsAsync(property);
            _userManagerMock.Setup(x => x.FindByIdAsync(dto.UserId.ToString()))
                .ReturnsAsync(user);
        }
    }
}