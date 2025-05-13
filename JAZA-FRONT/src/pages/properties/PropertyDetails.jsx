import { Container, Grid, Icon, IconButton } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react'
import apartmentImage from '../../assets/apartment.png';

function PropertyDetails({ property }) {
    let daysListed = Math.abs(new Date() - new Date(property.listDate).getTime()) / (1000 * 60 * 60 * 24);
    daysListed = Math.ceil(daysListed);
    const [isFavorite, setIsFavorite] = useState(false);


    return (
        <Container>
            <Grid container>
                <Grid size={12}>
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
                    <IconButton aria-label='save' onClick={() => setIsFavorite(!isFavorite)}>
                        <FavoriteIcon />
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
                <Grid size={12}>
                    <p>{daysListed} days</p>
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