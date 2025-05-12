using Project_2.Models;
using NetTopologySuite.Geometries;

namespace Project_2.Tests;

public static class SharedObjects {
    
    // static data fields
    public static readonly Guid VALID_PROPERTY_ID_1 = Guid.Parse("2aca7b35-d857-4ede-8a5e-a142d70f81a7");
    public static readonly Guid VALID_PROPERTY_ID_2 = Guid.Parse("fac4041a-c616-497e-8dfe-6eb716ac80a0");
    public static readonly Guid VALID_PROPERTY_ID_3 = Guid.Parse("e4206fd6-7b94-4822-87de-c85bf45bbe8d");
    public static readonly Guid INVALID_PROPERTY_ID = Guid.Parse("91eb0535-e333-4304-a2be-c9b95750f6e8");
    public static readonly Guid VALID_USER_ID_1 = Guid.Parse("69c47d10-1f90-43ab-8838-7d628a597d24");
    public static readonly Guid VALID_USER_ID_2 = Guid.Parse("71e70c14-2ef1-4df9-8094-031d49cf1864");
    public static readonly Guid INVALID_USER_ID = Guid.Parse("4a00312e-8361-4703-89bd-09ecdc4c5771");

    // testing objects
    public static Property CloneValidProperty1() {
        return new Property() {
            PropertyID = VALID_PROPERTY_ID_1,
            Country = "USA",
            State = "Florida",
            City = "Tampa",
            ZipCode = "33610",
            StreetAddress = "6603 Oakview Terrace",
            Coordinates = new Point(28.008006, -82.418377),
            StartingPrice = 325000m,
            Bedrooms = 3,
            Bathrooms = 2m,
            Garages = 2,
            Pools = 0,
            OwnerID = VALID_USER_ID_1,
            ForSale = true,
        };
    }

    public static Property CloneValidProperty2() {
        return new Property() {
            PropertyID = VALID_PROPERTY_ID_2,
            Country = "USA",
            State = "Florida",
            City = "Tampa",
            ZipCode = "33613",
            StreetAddress = "14317 Hanging Moss Circle",
            Coordinates = new Point(28.076659, -82.413720),
            StartingPrice = 149999.99m,
            Bedrooms = 2,
            Bathrooms = 2m,
            Garages = 0,
            Pools = 0,
            OwnerID = VALID_USER_ID_1,
            ForSale = true,
        };
    }

    public static Property CloneValidProperty3() {
        return new Property() {
            PropertyID = VALID_PROPERTY_ID_3,
            Country = "USA",
            State = "Florida",
            City = "Miami",
            ZipCode = "33134",
            StreetAddress = "3015 Granada Blvd",
            Coordinates = new Point(25.742810, -80.274326),
            StartingPrice = 3895000m,
            Bedrooms = 4,
            Bathrooms = 5m,
            Garages = 3,
            Pools = 1,
            OwnerID = VALID_USER_ID_2,
            ForSale = true,
        };
    }
}