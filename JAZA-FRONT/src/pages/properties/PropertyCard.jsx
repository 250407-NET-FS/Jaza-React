import React from 'react';
import houseImage from '../../assets/house.png';

const PropertyCard = ({ title, description }) => {
    return (
        <div>
            <img src={houseImage} alt={title} style={{ width: '100%', height: 'auto', border: '1px solid black' }} />
            <div id="carousel-Item-text" style={{ padding: '1px', backgroundColor: 'white', borderRadius: '5px', textAlign: 'center' }}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default PropertyCard;