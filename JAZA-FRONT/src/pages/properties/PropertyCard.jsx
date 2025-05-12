import React from 'react';
import houseImage from '../../assets/house.png';

const PropertyCard = ({ title, description }) => {
    return (
        <div>
            <img src={houseImage} alt={title} style={{ width: '100%', height: 'auto' }} />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default PropertyCard;