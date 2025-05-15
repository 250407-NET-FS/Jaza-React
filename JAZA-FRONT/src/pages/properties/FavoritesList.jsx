import React, { useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Container, Grid } from '@mui/material';
import NavBar from "../shared/NavBar";
import { useFavorite } from '../context/FavoritesContext';
import { useProperty } from '../context/PropertyContext';
import { useOwner } from '../context/OwnerContext';
import { api } from '../services/api';

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

    const propertyIds = new Set();
    favoritesList.forEach(f => {
        if (f.propertyId) {
            propertyIds.add(f.propertyId);
        }
    });
    console.log(favoritesList);
    let savedList = propertyList.filter(p => propertyIds.has(p.propertyID));
    
  return (
    <>
        <NavBar/>
        <Container>
            <h1>Your Listings</h1>
            <Grid container>
                {!savedList && <p class="text-muted">You have no listings yet.</p>}
                {
                    savedList.map(p => {
                        return (
                            <Grid key={p.propertyID}>
                                <Card>
                                    <img src={p.imageLink} alt={p.streetAddress} />
                                    <CardHeader>Street Address</CardHeader>
                                    <CardContent>
                                        <pre>
                                            {p.streetAddress}, {p.city}, {p.state} {p.zipCode}<br />
                                            Beds: {p.bedrooms} Baths: {p.bathrooms}<br />
                                            Price: ${p.startingPrice}
                                        </pre>
                                        <form method="post" onSubmit={() => markFavorite(p.propertyID, selectedOwner.id)}>
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
    </>
  )
}

export default FavoritesList