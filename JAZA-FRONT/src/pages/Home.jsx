import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/JAZA.png'; // Adjust if needed
import { useAuth } from "./context/AuthContext";
import '../App.css';

export default function Home() {
    const [search, setSearch] = useState("");
    const { user, login, logout } = useAuth()

    const listings = [
        { title: "Rustic Farmhouse", description: "3 bed · 2 bath · Countryside" },
        { title: "Cozy Bungalow", description: "2 bed · 1 bath · Urban charm" },
        { title: "Modern Loft", description: "1 bed · 1 bath · Downtown vibes" },
        { title: "Rustic Farmhouse", description: "3 bed · 2 bath · Countryside" },
        { title: "Cozy Bungalow", description: "2 bed · 1 bath · Urban charm" },
        { title: "Modern Loft", description: "1 bed · 1 bath · Downtown vibes" },
        // ... add more listings as needed  
    ];

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase())
    );

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
                    {filteredListings.map((listing, index) => (
                        <PropertyCard key={index} title={listing.title} description={listing.description} />
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