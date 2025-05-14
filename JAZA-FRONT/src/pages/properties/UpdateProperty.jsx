import React, {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Container, Grid, FormGroup, FormControl, FormControlLabel, FormLabel, Input, Checkbox } from '@mui/material'

function UpdateProperty({property}) {
    const {updateProperty} = useProperty();
    const {user} = useAuth();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [propertyInfo, setPropertyInfo] = useState({
        propertyID: property.propertyID,
        streetAddress: property.streetAddress,
        city: property.city,
        state: property.state,
        country: property.country,
        zipCode: property.zipCode,
        imagelink: null,
        latitude: property.latitude,
        longitude: property.longitude,
        startingPrice: property.startingPrice,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        garages: property.garages,
        pools: property.pools,
        hasBasement: (property.hasBasement === 'true'),
        ownerID: user.id
    });

    // eslint-disable-next-line no-undef
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const success = await updateProperty(propertyInfo);

        if (success) {
            setSuccessMessage('Create property successful!');
            setErrorMessage(null);
            navigate("/listings");
        } else {
            setErrorMessage('Create property failed. Please try again.');
        }
        } catch (errorMessage) {
            setErrorMessage("Invalid credentials. Please try again.");
            return;
        }
    }

  return (
    <Container>
        <h1>Edit Property</h1>
        <hr />
        <Grid container>
            <Grid size={12}>
                <form method="post" onSubmit={handleSubmit}>
                        <FormGroup>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input type="text" value={propertyInfo.streetAddress} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, streetAddress: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input type="text" value={propertyInfo.city} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, city: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input type="text" value={propertyInfo.state} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, state: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input type="text" value={propertyInfo.country} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, country: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                                <Input type="text" value={propertyInfo.zipCode}
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, zipCode: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                                <Input type="number" value={propertyInfo.bedrooms} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, bedrooms: e.target.value })
                                    }
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                                <Input type="number" value={propertyInfo.bathrooms} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, bathrooms: e.target.value })
                                    }
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Garages</FormLabel>
                            <FormControl>
                                <Input type="number" value={propertyInfo.garages} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, garages: e.target.value })
                                    }
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Pools</FormLabel>
                            <FormControl>
                                <Input type="number" value={propertyInfo.pools}
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, pools: e.target.value })
                                    }
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Has Basement?</FormLabel>
                            <FormControlLabel control={<Checkbox value={propertyInfo.hasBasement}
                                    onChange={(e) => 
                                        setPropertyInfo({ ...propertyInfo, hasBasement: e.target.value })
                                    }
                                ></Checkbox>
                            }>
                            </FormControlLabel>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Starting Price</FormLabel>
                            <FormControl>
                                <Input type="money" value={propertyInfo.startingPrice} 
                                    onChange={(e) =>
                                        setPropertyInfo({ ...propertyInfo, startingPrice: e.target.value })
                                    }
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Coordinates (Latitude, Longitude)</FormLabel>
                                <Input type="number" value={propertyInfo.latitude}
                                    onChange={(e) => 
                                        setPropertyInfo({ ...propertyInfo, latitude: e.target.value })
                                    }
                                    required
                                />
                                <Input type="number" value={propertyInfo.longitude}
                                    onChange={(e) => 
                                        setPropertyInfo({ ...propertyInfo, longitude: e.target.value })
                                    }
                                    required
                                />
                        </FormGroup>
                        <FormGroup>
                            <Input type="submit" value="Update" color='primary' />
                        </FormGroup>
                </form>
            </Grid>
        </Grid>
    </Container>
  );
}

export default UpdateProperty;