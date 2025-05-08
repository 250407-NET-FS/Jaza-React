using Xunit;
using Project_2.Models;
using Project_2.Services.Services;
using Project_2.Data;
using Project_2.Models.DTOs;
using Moq;
using Microsoft.EntityFrameworkCore;

// tests
// get all properties
// remove a property
// add new property
// remove property when user is not owner
// add new property but save fails
// get property by id
// get property not found
// remove property that does not exist throw execption
// update property fails throw exception
// update property not found throw exception



namespace Project_2.Tests
{
    public class TestProperty
    {
        private readonly Mock<IPropertyRepository> _propertyRepositoryMock;
        private readonly PropertyService _propertyService;

        public TestProperty()
        {
            _propertyRepositoryMock = new Mock<IPropertyRepository>();
            _propertyService = new PropertyService(_propertyRepositoryMock.Object, null);
        }


        [Fact]
        public async Task GetAllAsync_ShouldReturnAllProperties()
        {
            var expectedProperties = new List<Property>
            { //Property.Property(string Country, string State, string City, 
            // string ZipCode, string ImageLink, int garages, string StreetAddress,
            // decimal StartingPrice, int Bedrooms, decimal Bathrooms, int pools)
                 new Property(
                    "USA",
                    "florida",
                    "orlando",
                    "55555",
                    null,
                    0,
                    "123 florida man st",
                    1,
                    100,
                    20,
                    0,
                    Guid.NewGuid()
                    ),
                    new Property(
                    "idk",
                    "moon",
                    "blackhole",
                    "787878",
                    null,
                    0,
                    "123 oblivion",
                    111,
                    1,
                    1,
                    100,
                    Guid.NewGuid()
                    ),
                    new Property(
                    "CANADA",
                    "Ontario",
                    "quebec",
                    "88889",
                    null,
                    1,
                    "123 maple street",
                    9999999999,
                    100000,
                    200000,
                    0,
                    Guid.NewGuid()
                    )
            };
            var propertyRepositoryMock = new Mock<IPropertyRepository>();
            propertyRepositoryMock
                .Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(expectedProperties);
            var result = await propertyRepositoryMock.Object.GetAllAsync();
            Assert.NotNull(result);
            propertyRepositoryMock.Verify(repo => repo.GetAllAsync());
        }

        [Fact]
        public async Task RemovePropertyAsync_ShouldRemoveProperty()
        {
            var propertyId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var property = new Property(
                "USA", "NY", "NYC", "10001",
                "123 Test St", 500000, 3, 2, Guid.NewGuid())
            {
                PropertyID = propertyId,
                OwnerID = userId
            };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(property);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            await _propertyService.RemovePropertyAsync(propertyId, userId);

            _propertyRepositoryMock.Verify(repo => repo.Remove(property));
        }


        [Fact]
        public async Task AddNewPropertyAsync_ShouldAddProperty()
        {
            var propertyDTO = new PropertyAddDTO
            {
                Country = "USA",
                State = "NY",
                City = "NYC",
                ZipCode = "10001",
                StreetAddress = "123 Test St",
                StartingPrice = 500000,
                Bedrooms = 3,
                Bathrooms = 2
            };

            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            var result = await _propertyService.AddNewPropertyAsync(propertyDTO);

            Assert.NotEqual(Guid.Empty, result);
            _propertyRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Property>()));
        }


        [Fact]
        public async Task RemovePropertyAsync_WhenUnauthorized_ShouldThrowException()
        {

            var propertyId = Guid.NewGuid();
            var ownerId = Guid.NewGuid();
            var unauthorizedUserId = Guid.NewGuid();
            var property = new Property(
                "USA", "NY", "NYC", "10001",
                "123 Test St", 500000, 3, 2, Guid.NewGuid())
            {
                PropertyID = propertyId,
                OwnerID = ownerId
            };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(property);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.RemovePropertyAsync(propertyId, unauthorizedUserId));
            Assert.Equal("Unauthorized", exception.Message);
        }

        [Fact]
        public async Task AddNewPropertyAsync_WhenSaveFails_ShouldThrowException()
        {

            var propertyDTO = new PropertyAddDTO
            {
                Country = "USA",
                State = "NY",
                City = "NYC",
                ZipCode = "10001",
                StreetAddress = "123 Test St",
                StartingPrice = 500000,
                Bedrooms = 3,
                Bathrooms = 2
            };

            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(0);


            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.AddNewPropertyAsync(propertyDTO));
            Assert.Equal("Failed to insert property", exception.Message);
        }


        [Fact]
        public async Task GetByIdAsync_ShouldReturnProperty()
        {

            var propertyId = Guid.NewGuid();
            var expected = new Property(
                "USA", "NY", "NYC", "10001",
                "123 Test St", 500000, 3, 2, Guid.NewGuid())
            {
                PropertyID = propertyId
            };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(expected);


            var result = await _propertyService.GetPropertyByIdAsync(propertyId);

            Assert.NotNull(result);
            Assert.Equal(propertyId, result.PropertyID);
            _propertyRepositoryMock.Verify(repo => repo.GetByIdAsync(propertyId));
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNull()
        {
            var propertyId = Guid.NewGuid();
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);


            var result = await _propertyService.GetPropertyByIdAsync(propertyId);


            Assert.Null(result);
            _propertyRepositoryMock.Verify(repo => repo.GetByIdAsync(propertyId));
        }

        [Fact]
        public async Task UpdatePropertyAsync_ShouldUpdateProperty()
        {
            var propertyId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var propertyDTO = new PropertyUpdateDTO
            {
                PropertyID = propertyId,
                Country = "USA",
                State = "NY",
                City = "NYC",
                ZipCode = "10001",
                StreetAddress = "123 Test St",
                StartingPrice = 500000,
                Bedrooms = 3,
                Bathrooms = 2
            };

            var existingProperty = new Property(
                "USA", "NY", "NYC", "10001",
                "123 Test St", 500000, 3, 2, Guid.NewGuid())
            {
                PropertyID = propertyId,
                OwnerID = userId
            };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            await _propertyService.UpdatePropertyAsync(propertyDTO, userId);

            _propertyRepositoryMock.Verify(repo => repo.Update(propertyDTO), Times.Once);
            _propertyRepositoryMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdatePropertyAsync_WhenPropertyNotFound_ShouldThrowException()
        {
            var propertyId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var propertyDTO = new PropertyUpdateDTO { PropertyID = propertyId };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.UpdatePropertyAsync(propertyDTO, userId));
            Assert.Equal("Property not found", exception.Message);
        }

        [Fact]
        public async Task UpdatePropertyAsync_WhenSaveFails_ShouldThrowException()
        {
            var propertyId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var propertyDTO = new PropertyUpdateDTO { PropertyID = propertyId };
            var existingProperty = new Property(
                "USA", "NY", "NYC", "10001",
                "123 Test St", 500000, 3, 2, Guid.NewGuid())
            {
                PropertyID = propertyId,
                OwnerID = userId
            };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(0);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.UpdatePropertyAsync(propertyDTO, userId));
            Assert.Equal("Failed to update property", exception.Message);
        }

        [Fact]
        public async Task RemovePropertyAsync_WhenPropertyNotFound_ShouldThrowException()
        {
            var propertyId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.RemovePropertyAsync(propertyId, userId));
            Assert.Equal("Property not found", exception.Message);
        }

    }
}