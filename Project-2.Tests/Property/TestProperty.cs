using Xunit;
using Project_2.Models;
using Project_2.Services.Services;
using Project_2.Data;
using Project_2.Models.DTOs;
using NetTopologySuite.Geometries;
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
            var expectedProperties = new List<Property>{ 
                SharedObjects.CloneValidProperty1(),
                SharedObjects.CloneValidProperty2(),
                SharedObjects.CloneValidProperty3()
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
            Property property = SharedObjects.CloneValidProperty1();
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1))
                .ReturnsAsync(property);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            await _propertyService.RemovePropertyAsync(SharedObjects.VALID_PROPERTY_ID_1, SharedObjects.VALID_USER_ID_1);

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
                Latitude = 1.1,
                Longitude = 1.1,
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
            Property property = SharedObjects.CloneValidProperty1();
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1))
                .ReturnsAsync(property);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.RemovePropertyAsync(SharedObjects.VALID_PROPERTY_ID_1, SharedObjects.INVALID_USER_ID));
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
                Latitude = 1.1,
                Longitude = 1.1,
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
            Property property = SharedObjects.CloneValidProperty1();
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1))
                .ReturnsAsync(property);

            var result = await _propertyService.GetPropertyByIdAsync(SharedObjects.VALID_PROPERTY_ID_1);

            Assert.NotNull(result);
            Assert.Equal(SharedObjects.VALID_PROPERTY_ID_1, result.PropertyID);
            _propertyRepositoryMock.Verify(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1));
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNull()
        {
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.INVALID_PROPERTY_ID))
                .ReturnsAsync((Property?)null);


            var result = await _propertyService.GetPropertyByIdAsync(SharedObjects.INVALID_PROPERTY_ID);


            Assert.Null(result);
            _propertyRepositoryMock.Verify(repo => repo.GetByIdAsync(SharedObjects.INVALID_PROPERTY_ID));
        }

        [Fact]
        public async Task UpdatePropertyAsync_ShouldUpdateProperty()
        {
            var propertyDTO = new PropertyUpdateDTO
            {
                PropertyID = SharedObjects.VALID_PROPERTY_ID_1,
                Country = "USA",
                State = "NY",
                City = "NYC",
                ZipCode = "10001",
                StreetAddress = "123 Test St",
                StartingPrice = 500000,
                Bedrooms = 3,
                Bathrooms = 2
            };

            var existingProperty = SharedObjects.CloneValidProperty1();

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1))
                .ReturnsAsync(existingProperty);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(1);

            await _propertyService.UpdatePropertyAsync(propertyDTO, SharedObjects.VALID_USER_ID_1);

            _propertyRepositoryMock.Verify(repo => repo.Update(propertyDTO), Times.Once);
            _propertyRepositoryMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdatePropertyAsync_WhenPropertyNotFound_ShouldThrowException()
        {
            var propertyDTO = new PropertyUpdateDTO { PropertyID = SharedObjects.INVALID_PROPERTY_ID };

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.INVALID_PROPERTY_ID))
                .ReturnsAsync((Property?)null);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.UpdatePropertyAsync(propertyDTO, SharedObjects.VALID_USER_ID_1));
            Assert.Equal("Property not found", exception.Message);
        }

        [Fact]
        public async Task UpdatePropertyAsync_WhenSaveFails_ShouldThrowException()
        {
            var propertyDTO = new PropertyUpdateDTO { PropertyID = SharedObjects.VALID_PROPERTY_ID_1 };
            var existingProperty = SharedObjects.CloneValidProperty1();

            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(SharedObjects.VALID_PROPERTY_ID_1))
                .ReturnsAsync(existingProperty);
            _propertyRepositoryMock
                .Setup(repo => repo.SaveChangesAsync())
                .ReturnsAsync(0);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.UpdatePropertyAsync(propertyDTO, SharedObjects.VALID_USER_ID_1));
            Assert.Equal("Failed to update property", exception.Message);
        }

        [Fact]
        public async Task RemovePropertyAsync_WhenPropertyNotFound_ShouldThrowException()
        {
            _propertyRepositoryMock
                .Setup(repo => repo.GetByIdAsync(   SharedObjects.INVALID_PROPERTY_ID))
                .ReturnsAsync((Property?)null);

            var exception = await Assert.ThrowsAsync<Exception>(
                () => _propertyService.RemovePropertyAsync(SharedObjects.INVALID_PROPERTY_ID, SharedObjects.VALID_USER_ID_1));
            Assert.Equal("Property not found", exception.Message);
        }

    }
}