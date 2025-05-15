import React, { useState, useEffect } from 'react';
import NavBar from '../shared/NavBar';
import { useOffer } from '../context/OfferContext';
import AcceptOffer from './AcceptOffer';
import { CardContent, Card, Container, Grid,  } from '@mui/material';
import Popup from "reactjs-popup";

function ViewOffers(){
    const { offerList, selectedOffer, fetchPropertyOffers, fetchOffer } = useOffer();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [offerPopupOpen, setOfferPopupOpen] = useState(false);

    if (!offerList.length) return <div>No Offers available</div>;

    const handleFetch = async (offer) => {
        await fetchOffer(offer.offerId);
        setOfferPopupOpen(true);
    }

    return(
        <>
            <NavBar />
            <Container>
                <h1>Offers</h1>
                <Grid container>
                    {
                        offerList.map(o => 
                            <Grid size={12} key={o.offerId}>
                                <Card sx={{width: "100%"}}>
                                    <CardContent>
                                        <h1>Offer ID: {o.offerId}</h1>
                                        <h2>Bid Amount: {o.bidAmount}</h2>
                                        <h3>User ID: {o.userId}</h3>
                                        <h4>Date Posted: {o.date}</h4>
                                        <button onClick={() => handleFetch(o)}>Accept Offer</button>
                                    </CardContent>
                                    <Popup
                                        open={offerPopupOpen}
                                        closeOnDocumentClick
                                        onClose={() => setOfferPopupOpen(false)}
                                        className="popup-accept-offer"
                                        modal
                                        nested
                                        overlayStyle={{
                                            background: "rgba(0, 0, 0, 0.5)",
                                        }}
                                        contentStyle={{
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "10px",
                                            padding: "30px",
                                            maxWidth: "100%",
                                            margin: "100px auto",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                            fontFamily: "Arial, sans-serif",
                                        }}
                                    >
                                        <AcceptOffer></AcceptOffer>
                                    </Popup>
                                </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </>
    );

}

export default ViewOffers;