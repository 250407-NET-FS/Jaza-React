import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import logo from '../assets/JAZA.png'; // Adjust if needed
import { api } from './services/api';
import { useAuth } from "./context/AuthContext";
import { useProperty } from "./context/PropertyContext";
import PropertyCard from './properties/PropertyCard';
import Login from "./Login";
import '../App.css';

export default function Home() {
    const [search, setSearch] = useState("");
    const { user, login, logout } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    // helper functions for carousel animation
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 >= propertyList.length - 4 ? 0 : prevIndex + 1
        );
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? propertyList.length - 5 : prevIndex - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);
    console.log(propertyList);
    if (!propertyList.length) return <div>No properties available</div>;

    return (
        <div className="page">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="JAZA Logo" className="logo-image" />
                    <h1 className="logo-text">JAZA</h1>
                    <h2 className="welcome-user">
                        {user ? 'Welcome, ${user.name}' : 'Welcome, Guest'}
                    </h2>
                    {user?.fullName ? (
                        <button onClick={logout}>Logout</button>
                    ) : (
                        <Popup className="popup-login"
                            trigger={<button onClick={login}>Login</button>}
                            modal
                            nested
                            overlayStyle={{
                                background: 'rgba(0, 0, 0, 0.5)',
                            }}
                            contentStyle={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px',
                                padding: '30px',
                                maxWidth: '450px',
                                margin: '100px auto',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                fontFamily: 'Arial, sans-serif',
                            }}
                        >
                            <Login className="Login-form" />
                        </Popup>
                    )}
                </div>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/listings" className="nav-link">Listings</Link>
                    <Link to="/favorites" className="nav-link">Saved Searches</Link>
                </nav>
            </header>

            <section className="hero">
                <h2 className="hero-title">Find Your Warmth</h2>

                <input
                    type="text"
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                />
            </section>

            <main className="listings">
                <h3 className="section-title">Featured Listings</h3>
                <div className="carousel-wrapper">
                    <button className="carousel-button prev" onClick={prevSlide}>&lt;</button>
                    <div className="carousel-container">
                        {propertyList.slice(currentIndex, currentIndex + 5).map(property => (
                            <PropertyCard
                                key={property.propertyID}
                                title={property.streetAddress}
                                description={`${property.city}, ${property.state}`}
                            />
                        ))}
                    </div>
                    <button className="carousel-button next" onClick={nextSlide}>&gt;</button>
                </div>
            </main>

            <footer className="footer">
                <p>© 2025 JAZA Properties · All rights reserved.</p>
            </footer>
        </div>
    );
}
