import { Container } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import NavBar from "../shared/NavBar"
import 'leaflet/dist/leaflet.css';
import "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

function ChangeMapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center); // update the map's center
    }, [center, map]);
    return null;
}

function SearchResultDisplay() {
    const { propertyList, fetchPropertyList, fetchSearchList } = useProperty();
    const [center, setCenter] = useState([0, 0]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    
    useEffect(() => {
        if (search) {
            fetchSearchList(search);
        }
        else {
            fetchPropertyList(); // show all properties if empty search somehow or direct page nav
        }
    }, [search, fetchSearchList, fetchPropertyList]);

    useEffect(() => {
        // update center effect since propertyList is asynchronously populated
        if (propertyList.length > 0) {
            setCenter([propertyList[0].longitude, propertyList[0].latitude]);
        }
    }, [propertyList]);

    return (
        <>
            <NavBar/>
            <div style={{"paddingLeft": 0, "paddingRight": 0}}>
                <MapContainer center={center} zoom={14} scrollWheelZoom={false} style={{height: "calc(100vh - 66px)", width: "100vw"}}>
                <ChangeMapCenter center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {propertyList.map(p =>
                    <Marker key={p.propertyID} position={[p.longitude, p.latitude]}>
                        <Popup>
                            <PropertyCard property={p}/>
                        </Popup>
                    </Marker>
                )}
                </MapContainer>
            </div>
        </>
    )
}

export default SearchResultDisplay