import React from 'react';

const PropertyCard = ({ title, description }) => {
    return (
        <div className="carousel-item property-card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default PropertyCard;