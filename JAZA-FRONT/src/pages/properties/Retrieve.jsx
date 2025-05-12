import { Container, Grid, Icon, IconButton} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react'

function Retrieve(property) {
    let daysListed = Math.abs(Date.now - property.listedDate) / (1000 * 60 * 60 * 24);
  return (
    <Container>
        <Grid container>
            <Grid size={12}>
                <img src={property.imageLink} alt={property.streetAddress}></img>
                <IconButton aria-label='save'>
                    <FavoriteIcon></FavoriteIcon>
                </IconButton>
            </Grid>
            {/* TODO: Fill in property info for a specified property based on its id*/}
            <Grid size={4}>
                <pre>
                    {property.startingPrice}
                    {property.streetAddress}, {property.city}, {property.state}, {property.country} {property.zipCode}
                </pre>
            </Grid>
            <Grid size={4}>
                <p>{property.Bedrooms} beds</p>
            </Grid>
            <Grid size={4}>
                <p>{property.Bathrooms} baths</p>
            </Grid>

                <Grid size={12}>
                    <p>{daysListed} days</p>
                </Grid>

            <Grid size={12}>
                <p>Listing Created: {property.listedDate}</p>
                <p>Listed by: {property.ownerID}</p>
            </Grid>
        </Grid>
    </Container>
  )
}

export default Retrieve