import { Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import React, {useEffect} from 'react'

function UserPropertyList() {
    const { 
        propertyList, selectedProperty, fetchPropertyList, fetchProperty, 
        createProperty, updateProperty, deleteProperty
    } = useProperty();
    
    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

  return (
    <Container>
        <h1>Homes</h1>
        <Grid container>
            {
                propertyList.map(p => 
                    <Grid size={2}>
                        <Card key={p.propertyID}>
                            <CardContent>
                                <h3>{p.startingPrice}</h3>
                                <p>{p.bedrooms} | {p.bathrooms} - {p.forSale}</p>
                                <p>{p.streetAddress}, {p.city}, {p.state}, {p.country} {p.zipCode}</p>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            }
        </Grid>
    </Container>
  )
}

export default UserPropertyList