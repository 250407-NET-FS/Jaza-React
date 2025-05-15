import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { usePurchase } from '../context/PurchaseContext';
import { Alert, Button, Container, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useOffer } from '../context/OfferContext';

function AcceptOffer() {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const {selectedPurchase, acceptOffer} = usePurchase();
    const {user} = useAuth();
    const {selectedProperty} = useProperty();
    const {selectedOffer} = useOffer();

    const navigate = useNavigate();

    const credentials = {
      propertyId: selectedProperty.propertyID,
      userId: user.id,
      offerId: selectedOffer.offerId
    };

    const handleClick = async (e) => {
        e.preventDefault();

        console.log("Accepting Offer with:", {
            UserId: credentials.userId,
            PropertyId: credentials.propertyId,
            OfferId: credentials.offerId
        });

        try{
            await acceptOffer(credentials);

            if (selectedPurchase){
              setSuccessMessage('Accept offer successful!');
              setErrorMessage(null);
              navigate("/listings");
            } else {
                setErrorMessage('Accept offer failed. Please try again.');
                credentials.BidAmount = null;
            }
        } catch (errorMessage){
            setErrorMessage("Invalid credentials. Please try again.");
            return;
        }
    }

    return (
        <Container>
          <h1>Accept Offer for {selectedOffer?.offerId}</h1>
    
          {/* Alert Messages */}
          {errorMessage && (
            <Alert variant="outlined" severity="alert">
              {errorMessage}
            </Alert>
          )}
    
          {successMessage && (
            <Alert variant="outlined" severity="alert">
              {successMessage}
            </Alert>
          )}
    
          <hr />
          <Grid container>
            <Grid>
              <Button onClick={handleClick}>Yes</Button>
              <Button onClick={() => navigate("/listings")}>No</Button>
            </Grid>
          </Grid>
        </Container>
      );
}

export default AcceptOffer;