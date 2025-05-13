import { Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from 'react'
import Popup from "reactjs-popup";
import { Link } from 'react-router-dom';
import PropertyDetails from './PropertyDetails';
import houseImage from '../../assets/house.png';
import logo from "../../assets/JAZA.png";
import Login from "../Login";



function UserPropertyList() {
    const { user, logout, login } = useAuth();
    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();


    const [selectedProp, setSelectedProp] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [search, setSearch] = useState("");

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
            <div className="logo-container">
                <img src={logo} alt="JAZA Logo" className="logo-image" />
                <h1 className="logo-text">JAZA</h1>
                <h2 className="welcome-user">
                    {user ? `Welcome, ${user.fullName}` : "Welcome, Guest"}
                </h2>
                {user?.fullName ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <Popup
                        className="popup-login"
                        trigger={<button onClick={login}>Login</button>}
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
                        <Login className="Login-form" />
                    </Popup>
                )}
                {user?.role === "Admin" && (
                    <Link to="/admin/Dashboard" className="nav-link">
                        Admin Dashboard
                    </Link>
                )}

                <nav className="nav">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/listings" className="nav-link">
                        Listings
                    </Link>
                    <Link to="/favorites" className="nav-link">
                        Saved Searches
                    </Link>
                </nav>

                <section className="hero">
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-bar"
                    />
                </section>

            </div>
            <h3>Listings</h3>
            <Grid container>
                {
                    propertyList.map(p =>
                        <Grid item size={4} key={p.propertyID}>
                            <Card>
                                <CardContent>
                                    <button onClick={() => handleClick(p.propertyID)} style={{ all: 'unset', cursor: 'pointer' }}>
                                        <CardContent>
                                            <img
                                                src={houseImage}
                                                alt="Property address"
                                                style={{
                                                    width: '45%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                            <h3>{p.startingPrice}</h3>
                                            <p>{p.bedrooms} | {p.bathrooms} - {p.forSale}</p>
                                            <p>{p.streetAddress}, {p.city}, {p.state}, {p.country} {p.zipCode}</p>
                                        </CardContent>
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
                                cursor: 'pointer',
                                color: 'black'
                            }}
                        >
                            ×
                        </button>
                        <PropertyDetails property={selectedProp} />
                    </div>
                )}
            </Popup>
        </Container >
    )
}

export default UserPropertyList