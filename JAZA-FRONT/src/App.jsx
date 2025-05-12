import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // or './Home' if not in a folder
import Dashboard from "./pages/admin/Dashboard";
import PropertyList from "./pages/admin/PropertyList";
import FavoritesList from "./pages/properties/FavoritesList";
import UserList from "./pages/admin/UserList";
import Register from "./pages/Register";
import { AuthProvider } from "./pages/context/AuthContext";
import { PropertyProvider } from "./pages/context/PropertyContext";
import { OwnerProvider } from "./pages/context/OwnerContext";
import UserPropertyList from "./pages/properties/UserPropertyList";
import { FavoritesProvider } from "./pages/context/FavoritesContext";
import { OfferProvider } from "./pages/context/OfferContext";

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <OwnerProvider>
          <FavoritesProvider>
            <OfferProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin/Dashboard" element={<Dashboard />} />
                  <Route path="/UserList" element={<UserList />} />
                  <Route path="/listings" element={<UserPropertyList />} />
                  <Route path="/favorites" element={<FavoritesList />} />
                </Routes>
              </Router>
            </OfferProvider>
          </FavoritesProvider>
        </OwnerProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
