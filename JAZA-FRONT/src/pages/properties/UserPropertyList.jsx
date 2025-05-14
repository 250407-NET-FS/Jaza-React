import { Button, Card, CardContent, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState, useMemo } from 'react'
import Popup from "reactjs-popup";
import { Link } from 'react-router-dom';
import PropertyDetails from './PropertyDetails';
import CreateProperty from './CreateProperty';
import houseImage from '../../assets/house.png';
import logo from "../../assets/JAZA.png";
import Login from "../Login";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { api } from "../services/api";
import { PropertyContext } from "../context/PropertyContext";
import { useContext } from 'react';




function UserPropertyList() {
    const { user, logout, login } = useAuth();

    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();
    const [filteredResults, setFilteredResults] = useState([]);

    const [selectedProp, setSelectedProp] = useState(null);
    const [createPopupOpen, setCreatePopupOpen] = useState(false);
    const [detailPopupOpen, setDetailPopupOpen] = useState(false);


    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    const handleClick = (propertyID) => {
        const property = propertyList.find(p => p.propertyID === propertyID);
        if (property) {
            setSelectedProp(property);
            setDetailPopupOpen(true);
        }
    };

    const handleCreate = () => {
        setCreatePopupOpen(true);
    };

    const [bed, setBed] = useState('');
    const [bath, setBath] = useState('');
    const handleBedChange = (event) => {
        setBed(event.target.value);
    };
    const handleBathChange = (event) => {
        setBath(event.target.value);
    };
    useEffect(() => {
        const fetchPropertiesWithFilters = async () => {
            try {
                const params = {};
                if (bed !== '') params.bedrooms = bed;
                if (bath !== '') params.bathrooms = bath;

                const response = await api.get("properties", { params });
                if (response.data) {
                    let exactFilter = response.data;
                    if (bed !== '') {
                        exactFilter = exactFilter.filter(p => p.bedrooms === Number(bed));
                    }

                    if (bath !== '') {
                        exactFilter = exactFilter.filter(p => p.bathrooms === Number(bath));
                    }
                    setFilteredResults(exactFilter);
                }
            } catch (error) {
                console.error("Error fetching properties with filters:", error);
            }
        };

        fetchPropertiesWithFilters();
    }, [bed, bath]);


    return (
        <Container style={{
            maxWidth: '100%',
        }}>
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
            </div>

            <nav className="nav" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: '20px',
                padding: '10px 0',
            }}>
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
            <Grid container spacing={3}>
                <Grid size={8}>
                    <h3>Listings</h3>
                </Grid>
                <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="bed-label">Bedrooms</InputLabel>
                        <Select
                            labelId="bed-label"
                            id="bed-select"
                            value={bed}
                            onChange={handleBedChange}
                            label="Bedrooms"
                        >
                            <MenuItem value="">
                                <em>Any</em>
                            </MenuItem>
                            <MenuItem value={1}>1 Bedroom</MenuItem>
                            <MenuItem value={2}>2 Bedrooms</MenuItem>
                            <MenuItem value={3}>3 Bedrooms</MenuItem>
                            <MenuItem value={4}>4 Bedrooms</MenuItem>
                            <MenuItem value={5}>5 Bedrooms</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="bath-label">Bathrooms</InputLabel>
                        <Select
                            labelId="bath-label"
                            id="bath-select"
                            value={bath}
                            onChange={handleBathChange}
                            label="Bathrooms"
                        >
                            <MenuItem value="">
                                <em>Any</em>
                            </MenuItem>
                            <MenuItem value={1}>1 Bathroom</MenuItem>
                            <MenuItem value={2}>2 Bathrooms</MenuItem>
                            <MenuItem value={3}>3 Bathrooms</MenuItem>
                            <MenuItem value={4}>4 Bathrooms</MenuItem>
                            <MenuItem value={5}>5 Bathrooms</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={1}>
                    {user && <Button onClick={handleCreate} sx={{ all: 'unset', cursor: 'pointer', marginTop: '15px' }}>Create Listing</Button>}
                </Grid>
                {(filteredResults.length > 0 ? filteredResults : propertyList).map(p => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.propertyID}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                                }
                            }}
                            onClick={() => handleClick(p.propertyID)}
                        >
                            <CardContent sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 2
                            }}>
                                <div style={{
                                    marginBottom: '12px',
                                    width: '100%',
                                    height: '180px',
                                    overflow: 'hidden',
                                    borderRadius: '8px'
                                }}>
                                    <img
                                        src={houseImage}
                                        alt="Property address"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                <h3 style={{ margin: '0 0 8px 0' }}>${Number(p.startingPrice).toLocaleString()}</h3>
                                <p style={{ margin: '0 0 4px 0' }}>
                                    {p.bedrooms} beds | {p.bathrooms} baths - {p.forSale ? "For Sale" : "Not For Sale"}
                                </p>
                                <p style={{ margin: 0 }}>
                                    {p.streetAddress}, {p.city}, {p.state}
                                </p>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Popup
                open={createPopupOpen}
                closeOnDocumentClick
                onClose={() => setCreatePopupOpen(false)}
                modal
                nested
                overlayStyle={{
                    background: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    padding: "30px",
                    maxWidth: "80vw",
                    width: "80%",
                    height: '80vh',
                    margin: "auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative',
                    overflowY: 'auto',
                }}
            >
                <div>
                    <button
                        onClick={() => setCreatePopupOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: 'black',
                        }}
                    >
                        ×
                    </button>
                    <CreateProperty />
                </div>
            </Popup>
            <Popup
                open={detailPopupOpen}
                closeOnDocumentClick
                onClose={() => setDetailPopupOpen(false)}
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
                    height: '80vh',
                    margin: "auto",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    fontFamily: "Arial, sans-serif",
                    position: 'relative',
                    overflowY: 'auto',
                }}
            >
                {selectedProp && (
                    <div>
                        <button
                            onClick={() => setDetailPopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: 'black',
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



