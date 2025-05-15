import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Container, Grid } from '@mui/material';
import NavBar from "../shared/NavBar";
import { useFavorite } from '../context/FavoritesContext';
import { useProperty } from '../context/PropertyContext';
import { useOwner } from '../context/OwnerContext';
import Popup from "reactjs-popup";
import PropertyDetails from './PropertyDetails';

function FavoritesList() {

    const {
        favoritesList, foundFavorite,
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    const { selectedOwner, fetchLoggedOwner } = useOwner();

    const [selectedProp, setSelectedProp] = useState(null);
    const [detailPopupOpen, setDetailPopupOpen] = useState(false);

    useEffect(() => {
        fetchFavoritesList();
    }, []);

    useEffect(() => {
        fetchPropertyList();
    }, []);

    useEffect(() => {
        fetchLoggedOwner();
    }, []);

    const propertyIds = new Set();
    favoritesList.forEach(f => {
        if (f.propertyId) {
            propertyIds.add(f.propertyId);
        }
    });
    // console.log(favoritesList);
    let savedList = propertyList.filter(p => propertyIds.has(p.propertyID));

    const handlePropertyClick = (property) => {
        setSelectedProp(property);
        setDetailPopupOpen(true);
    };

    return (
        <>
            <NavBar />
            <Container>
                <h1>Favorites</h1>
                <Grid container>
                    {!savedList && <p class="text-muted">You have no listings yet.</p>}
                    {
                        savedList.map(p => {
                            return (
                                <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.propertyID}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                                        }
                                    }}
                                        onClick={() => handlePropertyClick(p)}
                                    >
                                        <div style={{ padding: '12px' }}>
                                            <img src={p.imageLink || 'https://placehold.co/600x400'} alt={p.streetAddress} style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }} />
                                        </div>
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
            <Popup
                open={detailPopupOpen}
                closeOnDocumentClick
                onClose={() => setDetailPopupOpen(false)}
                modal
                nested
                overlayStyle={{
                    background: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    padding: "30px",
                    maxWidth: "800px",
                    width: "90%",
                    height: '80vh',
                    margin: "auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative',
                    overflowY: 'auto',
                }}
            >
                {selectedProp && (
                    <div>
                        <button
                            onClick={() => setDetailPopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: 'black',
                            }}
                        >
                            ×
                        </button>
                        <PropertyDetails property={selectedProp} />
                    </div>
                )}
            </Popup>
        </>
    )
}

export default FavoritesList