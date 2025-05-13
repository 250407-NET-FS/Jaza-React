import { Button, Container, Grid, Icon, IconButton} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, {useEffect} from 'react';
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useFavorite} from '../context/FavoritesContext';
import apartmentImage from '../../assets/apartment.png';
import CreateOffer from './CreateOffer';

function PropertyDetails({property}) {
    const { user, login, logout } = useAuth();

    const {
        favoritesList, foundFavorite, 
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    useEffect(() => {
        fetchFavoritesList()
    }, [fetchFavoritesList]);

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
            <Grid size={1}>
                <Button>
                    {
                        (user?.id == property.ownerID) ?
                        <Link to="/offers">View Offers</Link> :
                        <Popup
                            className="popup-login"
                            modal
                            nested
                            overlayStyle={{
                                background: "rgba(0, 0, 0, 0.5)",
                            }}
                            contentStyle={{
                                backgroundColor: "#f8f9fa",
                                borderRadius: "10px",
                                padding: "30px",
                                maxWidth: "900px",
                                margin: "100px auto",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                fontFamily: "Arial, sans-serif",
                            }}>
                                <CreateOffer>Create Offer</CreateOffer>
                        </Popup>
                    }
                </Button>

            </Grid>
            <Grid size={2}>
                <p>Listing Created: {property.listDate}</p>
                <p>Listed by: {property.ownerID}</p>
            </Grid>
        </Grid>
    </Container>
  )
}

export default PropertyDetails