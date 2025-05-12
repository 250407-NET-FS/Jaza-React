import React, { useEffect } from 'react';
import { Card, CardContent, Container, Grid } from '@mui/material'
import { useFavorite } from '../context/FavoritesContext';
import { useProperty } from '../context/PropertyContext';
import { useOwner } from '../context/OwnerContext';

function FavoritesList() {
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

    let savedList = propertyList.map(p => favoritesList.some(f => f.PropertyID == p.PropertyID));
  return (
    <Container>
        <h1>Your Listings</h1>
        <Grid container>
            {!savedList && <p class="text-muted">You have no listings yet.</p>}
            {
                savedList.map(p => {
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

export default FavoritesList