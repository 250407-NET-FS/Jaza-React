import { Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import React, { useEffect, useState } from 'react'
import Popup from "reactjs-popup";
import PropertyDetails from './PropertyDetails';

function UserPropertyList() {
    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    const [selectedProp, setSelectedProp] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    const handleClick = (propertyID) => {
        const property = propertyList.find(p => p.propertyID === propertyID);
        if (property) {
            setSelectedProp(property);
            setIsPopupOpen(true);
        }
    };

    return (
        <Container>
            <h1>Homes</h1>
            <Grid container>
                {
                    propertyList.map(p =>
                        <Grid size={2} key={p.propertyID}>
                            <Card>
                                <Popup
                                    className="popup-login"
                                    trigger={<button onClick={fetchProperty}></button>}
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
                                    <PropertyDetails property={p} />
                                </Popup>
                                <CardContent>
                                    <button onClick={() => handleClick(p.propertyID)} style={{ all: 'unset', cursor: 'pointer' }}>
                                        <h3>{p.startingPrice}</h3>
                                        <p>{p.bedrooms} | {p.bathrooms} - {p.forSale}</p>
                                        <p>{p.streetAddress}, {p.city}, {p.state}, {p.country} {p.zipCode}</p>
                                    </button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>

            <Popup
                open={isPopupOpen}
                closeOnDocumentClick
                onClose={() => setIsPopupOpen(false)}
                modal
                nested
                overlayStyle={{
                    background: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    padding: "30px",
                    maxWidth: "800px",
                    width: "90%",
                    margin: "100px auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative'
                }}
            >
                {selectedProp && (
                    <div>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                        <PropertyDetails property={selectedProp} />
                    </div>
                )}
            </Popup>

        </Container>
    )
}

export default UserPropertyList