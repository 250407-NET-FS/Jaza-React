/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOffer } from '../context/OfferContext';
import { useAuth } from '../context/AuthContext';

function CreateOffer({property}) {
  const { makeOffer, selectedOffer } = useOffer();
  const { user } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // eslint-disable-next-line no-undef
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    UserId: user.id,
    PropertyId: property.propertyID,
    BidAmount: 0.00
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Creating Offer with:", {
      UserId: credentials.UserId,
      PropertyId: credentials.PropertyId,
      BidAmount: credentials.BidAmount
    });

    try {
      await makeOffer(credentials);

      if (selectedOffer) {
        setSuccessMessage('Create offer successful!');
        setErrorMessage(null);
        navigate("/listings");
      } else {
        setErrorMessage('Create offer failed. Please try again.');
        credentials.BidAmount = null;
      }
    } catch (errorMessage) {
      setErrorMessage("Invalid credentials. Please try again.");
      return;
    }
  }

  return (
    <>
      <h1>Make Offer for {property?.PropertyId}</h1>

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
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <p>Bid Amount</p>
              <input
                type="money"
                value={credentials.BidAmount}
                onChange={(e) =>
                  setCredentials({ ...credentials, BidAmount: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <input
                type="submit"
                value="Create Offer"
                className="btn btn-outline-dark"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateOffer;