import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOffer } from '../context/OfferContext';
import { useProperty } from '../context/PropertyContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AcceptOffer from './AcceptOffer';
import { CardContent, Container, Grid,  } from '@mui/material';
import Popup from "reactjs-popup";

function ViewOffers(){
    const { offerList, selectedOffer, fetchPropertyOffers, fetchOffer } = useOffer();
    const {selectedProperty} = useProperty();

    const sendOff = {
        PropertyId: null,
        UserId: null,
        OfferId: null
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    // const { property } = location.state || {};

    useEffect(() => {
        fetchPropertyOffers(selectedProperty.propertyID);
    }, []);

    return(
        <Container>
            <h1>Offers</h1>
            {offerList.length > 0 ?
            <Grid container>
                {
                    offerList.map(o => 
                        <Grid size={2} key={o.OfferID}>
                            <Card>
                                <CardContent>
                                    <div>
                                        <h1>Offer ID: {o.OfferID}</h1>
                                        <h2>Bid Amount: {o.BidAmount}</h2>
                                        <h3>User ID: {o.UserId}</h3>
                                        <h4>Date Posted: {o.Date}</h4>
                                    </div>
                                </CardContent>
                                <Popup
                                    className="popup-accept-offer"
                                    trigger={<button onClick={fetchOffer(o.OfferID)}>Accept Offer</button>}
                                    modal
                                    nested
                                    overlayStyle={{
                                        background: "rgba(0, 0, 0, 0.5)",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "10px",
                                        padding: "30px",
                                        maxWidth: "450px",
                                        margin: "100px auto",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                        fontFamily: "Arial, sans-serif",
                                    }}
                                >
                                    {
                                        sendOff.PropertyId = property.propertyID
                                    }
                                    {
                                        sendOff.UserId = user.id
                                    }
                                    {
                                        sendOff.OfferId = o.OfferID
                                    }
                                    <AcceptOffer property={property} offer={selectedOffer} credentials={sendOff}></AcceptOffer>
                                </Popup>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>
            : <p>No offers have been made!</p>}
        </Container>
    );

}

export default ViewOffers;