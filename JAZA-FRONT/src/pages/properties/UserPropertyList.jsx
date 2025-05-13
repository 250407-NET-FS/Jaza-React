import { Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import React, {useEffect} from 'react'
import Retrieve from './Retrieve';

function UserPropertyList() {
    const { 
        propertyList, selectedProperty, fetchPropertyList, fetchProperty, 
        createProperty, updateProperty, deleteProperty
    } = useProperty();
    
    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    const handleClick = (propertyID) => {

    };

  return (
    <Container>
        <h1>Homes</h1>
        <Grid container>
            {
                propertyList.map(p => 
                    <Grid size={2} key={p.propertyID}>
                        <Card>
                            <CardContent>
                                <button onClick={() => handleClick(p.propertyID)}style={{ all: 'unset', cursor: 'pointer' }}>
                                <h3>{p.startingPrice}</h3>
                                <p>{p.bedrooms} | {p.bathrooms} - {p.forSale}</p>
                                <p>{p.streetAddress}, {p.city}, {p.state}, {p.country} {p.zipCode}</p>
                                </button>
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