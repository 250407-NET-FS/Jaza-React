import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/JAZA.png'; // Adjust if needed
import { useAuth } from "./context/AuthContext";
import { useProperty } from "./context/PropertyContext";
import '../App.css';

export default function Home() {
    const [search, setSearch] = useState("");
    const { user, login, logout } = useAuth();
    const { 
        propertyList, selectedProperty, fetchPropertyList, fetchProperty, 
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    return (
        <div className="page">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="JAZA Logo" className="logo-image" />
                    <h1 className="logo-text">JAZA</h1>
                    <h2 className="welcome-user">
                        {user ? 'Welcome, ${user.name}': 'Welcome, Guest'}
                    </h2>
                    {user ? <button onClick={logout}>logout</button> : <button onClick={login}>login</button>}
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
                <div className="cards">
                    {propertyList.map((listing, index) => (
                        <PropertyCard key={index} title={listing.StreetAddress} description={listing.Bedrooms + " | " + listing.Bathrooms} />
                    ))}
                </div>
            </main>

            <footer className="footer">
                <p>© 2025 JAZA Properties · All rights reserved.</p>
            </footer>
        </div>
    );
}

function PropertyCard({ title, description }) {
    return (
        <div className="card">
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}