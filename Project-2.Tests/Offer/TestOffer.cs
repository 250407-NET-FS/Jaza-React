
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;
using Project_2.Models;
using Project_2.Services;
using Project_2.Data;
using Project_2.Models.DTOs;


// tests
// Search offers
// add offers
// remove offers
// get offer by id
// get all offer for property
// get all offers by user
// search offer by dto passed in values


namespace Project_2.Tests
{
    public class OfferServiceTests
    {
        private readonly Mock<IOfferRepository> _offerRepositoryMock;
        private readonly Mock<IPropertyRepository> _propertyRepositoryMock;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly OfferService _offerService;

        public OfferServiceTests()
        {
            _offerRepositoryMock = new Mock<IOfferRepository>();
            _propertyRepositoryMock = new Mock<IPropertyRepository>();

            // Setup UserManager mock
            var store = new Mock<IUserStore<User>>();
            _userManagerMock = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);

            _offerService = new OfferService(
                _userManagerMock.Object,
                _offerRepositoryMock.Object,
                _propertyRepositoryMock.Object
            );
        }

        // Test for AddAsync method with valid data
        [Fact]
        public async Task AddAsync_ShouldAddOffer_AndHandleErrors()
        {
            // Arrange valid data
            OfferNewDTO offerDto = new OfferNewDTO
            {
                PropertyId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                BidAmount = 100.0m
            };

            Property property = new Property("CountryName", "StateName", "CityName", "StreetName", "ZipCode", 1000.0m, 3, 500.0m, Guid.NewGuid())
            {
                PropertyID = offerDto.PropertyId
            };

            User user = new User
            {
                UserName = "TestUser",
                Email = "testuser@example.com"
            };

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(offerDto.PropertyId)).ReturnsAsync(property);
            _userManagerMock.Setup(x => x.FindByIdAsync(offerDto.UserId.ToString())).ReturnsAsync(user);

            _offerRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Offer>())).Returns(Task.CompletedTask);
            _offerRepositoryMock.Setup(x => x.SaveChangesAsync()).Returns(Task.FromResult(1));

            // Act & Assert for valid data
            var result = await _offerService.AddAsync(offerDto);
            Assert.NotNull(result);
            Assert.Equal(offerDto.PropertyId, result.PropertyId);
            Assert.Equal(offerDto.UserId, result.UserId);
            Assert.Equal(offerDto.BidAmount, result.BidAmount);

            // Test for property not found
            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(offerDto.PropertyId)).ReturnsAsync((Property)null);
            var exception = await Assert.ThrowsAsync<Exception>(() => _offerService.AddAsync(offerDto));
            Assert.Equal("Property cannot be null", exception.Message);

            // Test for user not found
            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(offerDto.PropertyId)).ReturnsAsync(property);
            _userManagerMock.Setup(x => x.FindByIdAsync(offerDto.UserId.ToString())).ReturnsAsync((User)null);
            exception = await Assert.ThrowsAsync<Exception>(() => _offerService.AddAsync(offerDto));
            Assert.Equal("User cannot be null", exception.Message);

            // Test for invalid bid amount
            _userManagerMock.Setup(x => x.FindByIdAsync(offerDto.UserId.ToString())).ReturnsAsync(user);
            offerDto.BidAmount = -1.0m;
            exception = await Assert.ThrowsAsync<Exception>(() => _offerService.AddAsync(offerDto));
            Assert.Equal("Bid amount must be greater than zero", exception.Message);
        }

        // Test for RemoveAsync method
        [Fact]
        public async Task RemoveAsync_ShouldRemoveOffer_AndHandleErrors()
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer(Guid.NewGuid(), Guid.NewGuid(), 100.0m) { OfferID = offerId };

            _offerRepositoryMock.Setup(x => x.GetByIdAsync(offerId)).ReturnsAsync(offer);
            _offerRepositoryMock.Setup(x => x.Remove(It.IsAny<Offer>()));

            await _offerService.RemoveAsync(offerId);

            _offerRepositoryMock.Verify(x => x.Remove(It.IsAny<Offer>()), Times.Once);

            _offerRepositoryMock.Setup(x => x.GetByIdAsync(offerId)).ReturnsAsync((Offer)null);
            var exception = await Assert.ThrowsAsync<Exception>(() => _offerService.RemoveAsync(offerId));
            Assert.Equal("Offer not found", exception.Message);
        }

        // Test for GetByIdAsync method
        [Fact]
        public async Task GetByIdAsync_ShouldReturnOffer_AndHandleErrors()
        {
            Guid offerId = Guid.NewGuid();
            Offer offer = new Offer(Guid.NewGuid(), Guid.NewGuid(), 100.0m) { OfferID = offerId };

            _offerRepositoryMock.Setup(x => x.GetByIdAsync(offerId)).ReturnsAsync(offer);

            var result = await _offerService.GetByIdAsync(offerId);
            Assert.NotNull(result);
            Assert.Equal(offerId, result.OfferId);

            _offerRepositoryMock.Setup(x => x.GetByIdAsync(offerId)).ReturnsAsync((Offer)null);
            var exception = await Assert.ThrowsAsync<Exception>(() => _offerService.GetByIdAsync(offerId));
            Assert.Equal("Offer not found", exception.Message);
        }

        // Test for GetAllForProperty method
        [Fact]
        public async Task GetAllForProperty_ShouldReturnOffers_AndHandleErrors()
        {
            Guid propertyId = Guid.NewGuid();
            List<Offer> offers = new List<Offer>
            {
                new Offer(Guid.NewGuid(), Guid.NewGuid(), 100.0m),
                new Offer(Guid.NewGuid(), Guid.NewGuid(), 150.0m)
            };

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(propertyId)).ReturnsAsync(new Property("CountryName", "StateName", "CityName", "StreetName", "ZipCode", 1000.0m, 3, 500.0m, Guid.NewGuid()) { PropertyID = propertyId });
            _offerRepositoryMock.Setup(x => x.GetAllForProperty(propertyId)).ReturnsAsync(offers);

            var result = await _offerService.GetAllForPropertyAsync(propertyId);
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());

            _propertyRepositoryMock.Setup(x => x.GetByIdAsync(propertyId)).ReturnsAsync((Property)null);
            var exception = await Assert.ThrowsAsync<Exception>(() => _offerService.GetAllForPropertyAsync(propertyId));
            Assert.Equal("Property does not exist", exception.Message);
        }

        // Test for GetAllByUser method
        [Fact]
        public async Task GetAllByUser_ShouldReturnOffers_AndHandleErrors()
        {
            Guid userId = Guid.NewGuid();
            List<Offer> offers = new List<Offer>
            {
                new Offer(Guid.NewGuid(), userId, 100.0m),
                new Offer(Guid.NewGuid(), userId, 150.0m)
            };

            User user = new User { UserName = "TestUser", Email = "testuser@example.com" };
            _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString())).ReturnsAsync(user);
            _offerRepositoryMock.Setup(x => x.GetAllByUser(userId)).ReturnsAsync(offers);

            var result = await _offerService.GetAllByUserAsync(userId);
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());

            _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString())).ReturnsAsync((User)null);
            var exception = await Assert.ThrowsAsync<Exception>(() => _offerService.GetAllByUserAsync(userId));
            Assert.Equal("User does not exist.", exception.Message);
        }

        // Test for SearchOffersAsync method
        [Fact]
        public async Task SearchOffersAsync_ShouldSearchOffers_AndHandleErrors()
        {
            OfferSearchDTO searchDto = new OfferSearchDTO
            {
                OfferId = null,
                UserId = Guid.NewGuid(),
                PropertyId = Guid.NewGuid()
            };

            List<Offer> offers = new List<Offer>
            {
                new Offer(searchDto.UserId ?? Guid.Empty, searchDto.PropertyId ?? Guid.Empty, 100.0m),
                new Offer(searchDto.UserId ?? Guid.Empty, searchDto.PropertyId ?? Guid.Empty, 150.0m)
            };

            _offerRepositoryMock.Setup(x => x.GetAllAsync()).ReturnsAsync(offers);

            var result = await _offerService.SearchOffersAsync(searchDto);
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());

            searchDto = null;
            var exception = await Assert.ThrowsAsync<ArgumentException>(() => _offerService.SearchOffersAsync(searchDto));
            Assert.Equal("At least one search criterion (OfferId, UserId, or PropertyId) must be provided", exception.Message);
        }
    }
}