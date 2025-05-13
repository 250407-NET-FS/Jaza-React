import { Button, Container, Grid, Icon, IconButton} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useFavorite} from '../context/FavoritesContext';

function PropertyDetails({property}) {
    const { user, login, logout } = useAuth();

    const {
        favoritesList, foundFavorite, 
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    useEffect(() => {
        fetchFavoritesList()
    }, [fetchFavoritesList]);

    let daysListed = Math.abs(Date() - property.listDate.getTime) / (1000 * 60 * 60 * 24);
    //console.log(Date() - Date(property.listDate));
  return (
    <Container>
        <Grid container>
            <Grid size={12}>
                <img src={property.imageLink} alt={property.streetAddress}></img>
                <IconButton aria-label='save' onClick={() => markFavorite(property.propertyID, user?.id)}>
                    {
                        favoritesList.find(f => f.propertyId == property.propertyID) ?
                        <FavoriteIcon></FavoriteIcon> :
                        <FavoriteBorderIcon></FavoriteBorderIcon>
                    }
                </IconButton>
            </Grid>
            <Grid size={4}>
                <p>${property.startingPrice}</p>
                <p> 
                    {property.streetAddress}, {property.city}, {property.state}, {property.country} {property.zipCode}
                </p>
            </Grid>
            <Grid size={4}>
                <p>{property.bedrooms} </p>
                <p>beds</p>
            </Grid>
            <Grid size={4}>
                <p>{property.bathrooms} </p>
                <p>baths</p>
            </Grid>
            <Grid size={6}>
                <p>{daysListed} days</p>
            </Grid>
            <Grid size={6}>
                <Button>
                    {
                        (user?.id == property.ownerID) ?
                        <Link to="/offers">View Offers</Link> :
                        <Link to="/offers/create">Create Offer</Link>
                    }
                </Button>

            </Grid>
            <Grid size={12}>
                <p>Listing Created: {property.listDate}</p>
                <p>Listed by: {property.ownerID}</p>
            </Grid>
        </Grid>
    </Container>
  )
}

export default PropertyDetails