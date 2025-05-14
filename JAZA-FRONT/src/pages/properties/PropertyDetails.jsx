import { Button, Container, Grid, Icon, IconButton } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useEffect, useState } from 'react';
import Popup from "reactjs-popup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../context/FavoritesContext';
import { useProperty } from '../context/PropertyContext';
import CreateOffer from './CreateOffer';
import UpdateProperty from './UpdateProperty';
import apartmentImage from '../../assets/apartment.png';


function PropertyDetails({ property }) {
    const { user } = useAuth();
    const [offerPopupOpen, setOfferPopupOpen] = useState(false);
    const [updatePopupOpen, setUpdatePopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        favoritesList, foundFavorite,
        fetchFavoritesList, fetchCurrentFavorite, markFavorite
    } = useFavorite();

    const {deleteProperty} = useProperty();

    // eslint-disable-next-line no-undef
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavoritesList()
    }, [fetchFavoritesList]);

    const handleClick = () => {
        if (property) {
            setOfferPopupOpen(true);
        }
    };

    const handleUpdate = () => {
        setUpdatePopupOpen(true);
    };

    const handleDelete = async () => {

        try {
        const success = await deleteProperty(property.propertyID);

        if (success) {
            setSuccessMessage('Delete property successful!');
            setErrorMessage(null);
            navigate("/listings");
        } else {
            setErrorMessage('Delete property failed. Please try again.');
        }
        } catch (errorMessage) {
            setErrorMessage("Invalid credentials. Please try again.");
            return;
        }
    }

    let daysListed = Math.abs(new Date() - new Date(property.listDate).getTime()) / (1000 * 60 * 60 * 24);
    daysListed = Math.ceil(daysListed);
    return (
        <Container style={{
            maxHeight: '80vh',

        }}>
            <Grid container>
                <Grid size={12}>
                    <img
                        // src={property.imageLink || houseImage}
                        // alt={property.streetAddress}
                        src={apartmentImage}
                        alt="Property address"
                        style={{
                            width: '100%',
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
                <Grid size={8}>
                    <p>Days Listed: {daysListed} days</p>
                </Grid>
                <Grid size={4}>
                    {
                        (user?.id == property.ownerID) ?
                            <Button><Link to="/offers">View Offers</Link></Button> :
                            <Button onClick={handleClick} sx={{ all: 'unset', cursor: 'pointer' }}>Create Offer</Button>
                    }

                </Grid>
                <Grid size={8}>
                    <p>Listing Created: {property.listDate}</p>
                    <p>Listed by: {property.ownerID}</p>
                </Grid>
                <Grid size={4}>
                    {
                        (user?.id == property.ownerID) && 
                        <>
                            <Button onClick={handleUpdate} sx={{ all: `unset`, cursor: 'pointer' }}>Update Property</Button><br />
                            <Button onClick={handleDelete} sx={{ all: `unset`, cursor: `pointer `}}>Delete Property</Button>
                        </>
                    }
                </Grid>
            </Grid>
            <Popup
                open={offerPopupOpen}
                closeOnDocumentClick
                onClose={() => setOfferPopupOpen(false)}
                modal
                nested
                overlayStyle={{
                    background: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    padding: "30px",
                    maxWidth: "400px",
                    width: "90%",
                    height: "50%",
                    margin: "100px auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative',

                }}
            >
                {property && (
                    <div>
                        <button
                            onClick={() => setOfferPopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: 'black'
                            }}
                        >
                            ×
                        </button>
                        <CreateOffer property={property} />
                    </div>
                )}
            </Popup>
            <Popup
                open={updatePopupOpen}
                closeOnDocumentClick
                onClose={() => setUpdatePopupOpen(false)}
                modal
                nested
                overlayStyle={{
                    background: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    padding: "30px",
                    maxWidth: "400px",
                    width: "90%",
                    height: "50%",
                    margin: "100px auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative'
                }}
            >
                {property && (
                    <div>
                        <button
                            onClick={() => setUpdatePopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: 'black'
                            }}
                        >
                            ×
                        </button>
                        <UpdateProperty property={property} />
                    </div>
                )}
            </Popup>
        </Container>
    )
}

export default PropertyDetails