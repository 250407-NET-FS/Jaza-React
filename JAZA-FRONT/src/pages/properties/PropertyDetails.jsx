import { Button, Container, Grid, Icon, IconButton} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, {useEffect, useState} from 'react';
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useFavorite} from '../context/FavoritesContext';
import CreateOffer from './CreateOffer';
import apartmentImage from '../../assets/apartment.png';

function PropertyDetails({property}) {
    const { user, login, logout } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const {
        favoritesList, foundFavorite, 
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    useEffect(() => {
        fetchFavoritesList()
    }, [fetchFavoritesList]);

    const handleClick = () => {
        if (property) {
            setIsPopupOpen(true);
        }
    };

    let daysListed = Math.abs(new Date() - new Date(property.listDate).getTime()) / (1000 * 60 * 60 * 24);
    daysListed = Math.ceil(daysListed);
  return (
    <Container>
        <Grid container>
            <Grid size={4}>
                    <img
                        // src={property.imageLink || houseImage}
                        // alt={property.streetAddress}
                        src={apartmentImage}
                        alt="Property address"
                        style={{
                            width: '45%',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                    />
                <IconButton aria-label='save' onClick={() => markFavorite(property.propertyID, user?.id)}>
                    {
                        favoritesList.find(f => f.propertyId == property.propertyID) ?
                        <FavoriteIcon></FavoriteIcon> :
                        <FavoriteBorderIcon></FavoriteBorderIcon>
                    }
                </IconButton>
            </Grid>
            <Grid size={1}>
                <p>${property.startingPrice}</p>
                <p> 
                    {property.streetAddress}, {property.city}, {property.state}, {property.country} {property.zipCode}
                </p>
            </Grid>
            <Grid size={1}>
                <p>{property.bedrooms} </p>
                <p>beds</p>
            </Grid>
            <Grid size={1}>
                <p>{property.bathrooms} </p>
                <p>baths</p>
            </Grid>
            <Grid size={1}>
                <p>{daysListed} days</p>
            </Grid>
            <Grid size={6}>
                    {
                        (user?.id == property.ownerID) ?
                        <Button><Link to="/offers">View Offers</Link></Button> :
                        <Button onClick={() => handleClick(property.propertyID)} sx={{ all: 'unset', cursor: 'pointer' }}>Create Offer</Button>
                    }

            </Grid>
            <Grid size={2}>
                <p>Listing Created: {property.listDate}</p>
                <p>Listed by: {property.ownerID}</p>
            </Grid>
        </Grid>
        <Popup
            open={isPopupOpen}
            closeOnDocumentClick
            onClose={() => setIsPopupOpen(false)}
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
                margin: "100px auto",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                fontFamily: "Arial, sans-serif",
                position: 'relative'
            }}
        >
            {property && (
                <div>
                    <button
                        onClick={() => setIsPopupOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: 'black'
                        }}
                    >
                        ×
                    </button>
                    <CreateOffer property={property} />
                </div>
            )}
        </Popup>
    </Container>
  )
}

export default PropertyDetails