import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function AcceptOffer(property, offer, credentials) {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleClick= async () => {
        e.preventDefault();

        console.log("Accepting Offer with:", {
            UserId: credentials.UserId,
            PropertyId: credentials.PropertyId,
            OfferId: credentials.OfferId
        });

        try{
            const success = await api.post("purchase", credentials);

            if(success){
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
        <>
          <h1>Accept Offer for {offer?.OfferID}</h1>
    
          {/* Alert Messages */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
    
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
    
          <hr />
          <div className="row">
            <div className="col-md-4">
              <button onClick={() => handleClick}>Yes</button>
              <button onClick={navigate("/listings")}>No</button>
            </div>
          </div>
        </>
      );
}

export default AcceptOffer;