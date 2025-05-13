import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOffer } from '../context/OfferContext';
import { Navigate } from 'react-router-dom';
import AcceptOffer from './AcceptOffer';
import { CardContent } from '@mui/material';

function ViewOffers(property){
    const { offerlist, selectedOffer, fetchPropertyOffers, fetchOffer } = useOffer();

    const sendOff = {
        PropertyId: null,
        UserId: null,
        OfferId: null
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        PropertyId: property.propertyID,
    });

    useEffect(() => {
        fetchPropertyOffers(credentials.PropertyId);
    }, []);

    return(
        <Container>
            <h1>Offers</h1>
            <Grid container>
                {
                    offerlist.map(o => 
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
        </Container>
    );

}

export default ViewOffers;