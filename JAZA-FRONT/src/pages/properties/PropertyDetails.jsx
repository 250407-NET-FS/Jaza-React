import { Container, Grid, Icon, IconButton} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react'

function PropertyDetails({property}) {
    let daysListed = Math.abs(Date() - property.listDate.getTime) / (1000 * 60 * 60 * 24);
    console.log(Date() - Date(property.listDate));
  return (
    <Container>
        <Grid container>
            <Grid size={12}>
                <img src={property.imageLink} alt={property.streetAddress}></img>
                <IconButton aria-label='save'>
                    <FavoriteIcon></FavoriteIcon>
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