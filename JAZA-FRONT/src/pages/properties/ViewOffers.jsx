import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOffer } from '../context/OfferContext';
import { Navigate } from 'react-router-dom';

function viewOffers(property){
    const { offerlist, fetchPropertyOffers } = useOffer();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        PropertyId: property.propertyID,
    });

    useEffect(() => {
        fetchPropertyOffers(credentials.PropertyId);
    }, []);

    

}

export default viewOffers;