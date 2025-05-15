import React, { useEffect, useState } from "react";
import NavBar from "./shared/NavBar";
import SearchBar from "./shared/SearchBar"
import { useAuth } from "./context/AuthContext";
import { useProperty } from "./context/PropertyContext";
import PropertyCard from "./properties/PropertyCard";
import "../App.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const { user, login, logout } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const {
        propertyList,
        selectedProperty,
        fetchPropertyList,
        fetchProperty,
        createProperty,
        updateProperty,
        deleteProperty,
    } = useProperty();

    useEffect(() => {
        fetchPropertyList();
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
    if (!propertyList.length) return <div>No properties available</div>;

    return (
        <div className="page">
            <NavBar />
            <section className="hero">
                <h2 className="hero-title">Find Your Warmth</h2>
                <div id="searchb" style={{
                    width: '100vw',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
                    paddingBottom: '20px',
                }}>
                    <SearchBar />
                </div>
            </section>

            <main className="listings">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <h3 className="section-title">Featured Listings</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="carousel-button prev"
                            onClick={prevSlide}
                            style={{
                                border: 'none',
                                background: 'green',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '20px'
                            }}
                        >
                            &lt;
                        </button>
                        <button
                            className="carousel-button next"
                            onClick={nextSlide}
                            style={{
                                border: 'none',
                                background: 'green',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '20px'
                            }}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

                <div className="carousel-wrapper">
                    <div className="carousel-container" style={{
                        border: '10px solid #ccc',
                        borderRadius: '10px',
                        gap: '15px',
                        backgroundColor: '#ccc',
                    }}>
                        {propertyList
                            .slice(currentIndex, currentIndex + 5)
                            .map((property) => (
                                <PropertyCard key={property.propertyID} property={property} />
                            ))}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>© 2025 JAZA Properties · All rights reserved.</p>
            </footer>
        </div>
    );
}
