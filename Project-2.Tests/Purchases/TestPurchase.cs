using Xunit;
using Project_2.Models;
using Project_2.Services.Services;
using Project_2.Services;
using Project_2.Data;
using Project_2.Models.DTOs;
using Moq;
using System.Data;

//tests
// getall properties
// get a property by id
// Accept valid offer
// create a purchase with valid for sale
// throw exception if property not for sale


namespace Project_2.Tests;

public class TestPurchase
{
    private readonly Mock<IPurchaseRepository> _purchaseRepositoryMock;
    private readonly Mock<IPropertyRepository> _propertyRepositoryMock;
    private readonly Mock<IOfferRepository> _offerRepositoryMock;
    private readonly PurchaseService _purchaseService;

    public TestPurchase()
    {
        _purchaseRepositoryMock = new Mock<IPurchaseRepository>();
        _propertyRepositoryMock = new Mock<IPropertyRepository>();
        _offerRepositoryMock = new Mock<IOfferRepository>();

        _purchaseService = new PurchaseService(
            _offerRepositoryMock.Object,
            _propertyRepositoryMock.Object,
            _purchaseRepositoryMock.Object
        );
    }

    [Fact] //test get all purchases
    public async Task GetAllAsync_ShouldReturnAllPurchases()
    {
        var expectedPurchases = new List<Purchase>
        {
            // Create a list of Purchase objects with unique IDs and amounts.
            new Purchase(Guid.NewGuid(), Guid.NewGuid(), 100000),
            new Purchase(Guid.NewGuid(), Guid.NewGuid(), 200000)
        };
        // Set up the mock repository to return the expected purchases when GetAllAsync is called.
        _purchaseRepositoryMock
            .Setup(repo => repo.GetAllAsync())
            .ReturnsAsync(expectedPurchases);


        var result = await _purchaseService.GetAllPurchasesAsync();

        Assert.NotNull(result); //not null
        Assert.Equal(expectedPurchases.Count, result.Count()); //correct count of purchases
        Assert.Equal(expectedPurchases, result); //correct purchases returned
    }

    // [Fact] //test get purchase by id
    // public async Task GetByIdAsync_ShouldReturnPurchaseById()
    // {
    //     var purchaseId = Guid.NewGuid();
    //     var propertyId = Guid.NewGuid();
    //     var expectedPurchase = new Purchase(purchaseId, propertyId, 100000);

    //     _purchaseRepositoryMock
    //         .Setup(repo => repo.GetByIdAsync(purchaseId))
    //         .ReturnsAsync(expectedPurchase);

    //     var result = await _purchaseService.GetByIdAsync(purchaseId);

    //     Assert.NotNull(result); //not null
    //     Assert.Equal(expectedPurchase.PurchaseID, result.PurchaseID); //correct purchase ID
    //     _purchaseRepositoryMock.Verify(repo => repo.GetByIdAsync(purchaseId), Times.Once);
    // }

    // [Fact] //test get purchase by id
    // public async Task GetByIdAsync_ShouldReturnPurchasesByUserId()
    // {

    //     var userId = Guid.NewGuid();
    //     var expectedPurchases = new List<Purchase>
    //     {
    //         new Purchase(userId, Guid.NewGuid(), 100000),
    //         new Purchase(userId, Guid.NewGuid(), 200000)
    //     };

    //     _purchaseRepositoryMock
    //         .Setup(repo => repo.GetAllByUser(userId))
    //         .ReturnsAsync(expectedPurchases);


    //     var result = await _purchaseService.GetAllPurchasesByUserAsync(userId);

    //     Assert.NotNull(result);
    //     Assert.Equal(expectedPurchases.Count, result.Count());
    //     Assert.Equal(expectedPurchases, result);
    //     _purchaseRepositoryMock.Verify(repo => repo.GetAllByUser(userId), Times.Once);
    // }

    [Fact] //test accept offer
    public async Task AcceptOfferAsync_ValidPurchase_ReturnsPurchase()
    {
        var ownerId = SharedObjects.VALID_USER_ID_1;
        var buyerId = SharedObjects.VALID_USER_ID_2;
        var propertyId = SharedObjects.VALID_PROPERTY_ID_1;
        var offerId = Guid.NewGuid();
        decimal bidAmount = 100000;

        var property = SharedObjects.CloneValidProperty1();
        var offer = new Offer(buyerId, propertyId, bidAmount) { OfferID = offerId };
        var purchaseDto = new CreatePurchaseDTO { PropertyId = propertyId, UserId = ownerId, OfferId = offerId };

        _propertyRepositoryMock.Setup(repo => repo.GetByIdAsync(propertyId)).ReturnsAsync(property);
        _offerRepositoryMock.Setup(repo => repo.GetByIdAsync(offerId)).ReturnsAsync(offer);

        var result = await _purchaseService.AcceptOfferAsync(purchaseDto);

        Assert.NotNull(result);
        Assert.Equal(buyerId, result.OwnerID);
        Assert.Equal(propertyId, result.PropertyID);
        Assert.Equal(bidAmount, result.FinalPrice);
    }

    [Fact] //test purchase creation valid
    public async Task CreateAsync_ShouldCreatePurchase()
    {
        // Create GUIDs and test data
        var propertyId = SharedObjects.VALID_PROPERTY_ID_1;
        var ownerId = SharedObjects.VALID_USER_ID_1;
        var buyerId = SharedObjects.VALID_USER_ID_2;
        var offerId = Guid.NewGuid();
        decimal bidAmount = 2500000000000;

        // Setup property
        var property = SharedObjects.CloneValidProperty1();

        // Setup mocks using class fields
        _propertyRepositoryMock
            .Setup(repo => repo.GetByIdAsync(propertyId))
            .ReturnsAsync(property);

        _propertyRepositoryMock
            .Setup(repo => repo.Update(It.IsAny<PropertyUpdateDTO>()))
            .Verifiable();

        _propertyRepositoryMock
            .Setup(repo => repo.SaveChangesAsync())
            .ReturnsAsync(1);

        _offerRepositoryMock
            .Setup(repo => repo.GetByIdAsync(offerId))
            .ReturnsAsync(new Offer(buyerId, propertyId, bidAmount));

        var purchaseDTO = new CreatePurchaseDTO
        {
            PropertyId = propertyId,
            UserId = ownerId,
            OfferId = offerId
        };

        var result = await _purchaseService.AcceptOfferAsync(purchaseDTO);

        Assert.NotNull(result);
        Assert.Equal(buyerId, result.OwnerID);
        Assert.Equal(propertyId, result.PropertyID);
        Assert.Equal(bidAmount, result.FinalPrice);

        // Verify that the purchase was created with the correct parameters
        _purchaseRepositoryMock.Verify(repo => repo.AddAsync(
            It.Is<Purchase>(p =>
            p.OwnerID == buyerId &&
            p.PropertyID == propertyId &&
            p.FinalPrice == bidAmount))
            );
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowException_WhenPropertyNotForSale()
    {
        var propertyId = SharedObjects.VALID_PROPERTY_ID_1;
        var ownerId = Guid.NewGuid();
        var offerId = Guid.NewGuid();

        var property = SharedObjects.CloneValidProperty1();
        property.ForSale = false;

        var purchaseDTO = new CreatePurchaseDTO
        {
            PropertyId = propertyId,
            UserId = ownerId,
            OfferId = offerId,
        };

        _propertyRepositoryMock.Setup(repo => repo.GetByIdAsync(propertyId)).ReturnsAsync(property);

        // Assert that the method throws an exception
        var exception = await Assert.ThrowsAsync<Exception>(() =>
            _purchaseService.AcceptOfferAsync(purchaseDTO));
        Assert.Equal("Property not for sale", exception.Message);
    }
}
