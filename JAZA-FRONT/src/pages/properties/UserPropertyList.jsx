import { Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import React from 'react'

function UserPropertyList(list) {
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
                list.map(p => 
                    <Grid size={2}>
                        <Card key={p.PropertyID}>
                            <CardContent>
                                <h3>{p.StartingPrice}</h3>
                                <p>{p.Bedrooms} | {p.Bathrooms} - {p.ForSale}</p>
                                <p>{p.StreetAddress}, {p.City}, {p.State}, {p.Country} {p.ZipCode}</p>
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