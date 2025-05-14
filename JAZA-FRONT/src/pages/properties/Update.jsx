import React from 'react'
import { Container, Grid, FormGroup, FormControl, FormControlLabel, Input } from '@mui/material'

function UpdateProperty({property}) {
  return (
    <Container>
        <h1>Edit Property</h1>
        <hr />
        <Grid container>
            <Grid size={12}>
                <form method="post" onSubmit={onSubmit}>
                    <FormGroup>
                        <FormControlLabel>Street Address</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.streetAddress}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>City</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.city}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>State</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.state}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>Country</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.country}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>Bedrooms</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.bedrooms}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>Bathrooms</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.bathrooms}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>Garages</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.garages}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel>Starting Price</FormControlLabel>
                        <FormControl>
                            <Input defaultValue={property.startingPrice}/>                        
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Input type="submit" value="Update" color='primary'/>
                    </FormGroup>
                </form>
            </Grid>
        </Grid>
    </Container>
  );
}

export default UpdateProperty;