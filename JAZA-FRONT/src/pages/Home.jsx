import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import logo from '../assets/JAZA.png'; // Adjust if needed
import { api } from './services/api';
import { useAuth } from "./context/AuthContext";
import PropertyCard from './properties/PropertyCard';
import '../App.css';

export default function Home() {
    const [search, setSearch] = useState("");
    const { user, login, logout } = useAuth()
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // helper functions for carousel animation
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 >= properties.length - 4 ? 0 : prevIndex + 1
        );
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? properties.length - 5 : prevIndex - 1
        );
    };
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex]);
    //////////////////

    useEffect(() => {
        const getProperties = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('favorites/top-favorites');
                setProperties(data || []);
            } catch (err) {
                setProperties([]);
                console.error("Error fetching properties:", err);
            } finally {
                setLoading(false);
            }
        };

        getProperties();
    }, []);
    if (!properties.length) return <div>No properties available</div>;


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
                    <Popup
                        trigger={<button>Login</button>}
                        modal
                        nested
                    >
                        <Login className="Login-form" />
                    </Popup>
                    )}
                </div>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/listings" className="nav-link">Listings</Link>
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
                        {properties.slice(currentIndex, currentIndex + 5).map(property => (
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
