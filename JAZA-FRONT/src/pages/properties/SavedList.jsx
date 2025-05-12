import React, { useEffect } from 'react';
import { useFavorite } from '../context/FavoritesContext';
import { useProperty } from '../context/PropertyContext';
import { useOwner } from '../context/OwnerContext';

function SavedList() {
    const {
        favoritesList, foundFavorite, 
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    const { 
        propertyList, selectedProperty, fetchPropertyList, fetchProperty, 
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    const {selectedOwner, fetchLoggedOwner} = useOwner();

    useEffect(() => {
        fetchFavoritesList()
    }, [fetchFavoritesList]);

    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    useEffect(() => {
        fetchLoggedOwner()
    }, [selectedOwner]);

    propertyList = propertyList.filter(p => favoritesList.some(f => f.PropertyID == p.PropertyID));
  return (
    <Container>
        <h1>Your Listings</h1>
        <Grid container>
            {!propertyList && <p class="text-muted">You have no listings yet.</p>}
            {
                propertyList.map(p => {
                    return (
                        <Grid key={p.PropertyID}>
                            <Card>
                                <img src={p.ImageLink} alt={p.StreetAddress} />
                                <CardHeader>Street Address</CardHeader>
                                <CardContent>
                                    <pre>
                                        {p.StreetAddress}, {p.City}, {p.State} {p.ZipCode}<br />
                                        Beds: {p.Bedrooms} Baths: {p.Bathrooms}<br />
                                        Price: ${p.StartingPrice}
                                    </pre>
                                    <form method="post" onSubmit={() => markFavorite(p.PropertyID, selectedOwner.Id)}>
                                        <Button type="submit">
                                            Delete
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })
            }
        </Grid>
    </Container>
  )
}

export default SavedList