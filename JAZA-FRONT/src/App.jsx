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
import SearchResultDisplay from "./pages/properties/SearchResults";
import ViewOffers from "./pages/properties/ViewOffers";
import { FavoritesProvider } from "./pages/context/FavoritesContext";
import { OfferProvider } from "./pages/context/OfferContext";
import { PurchaseProvider } from "./pages/context/PurchaseContext";
import RequireAdmin from "./pages/admin/RequireAdmin";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <OwnerProvider>
          <FavoritesProvider>
            <OfferProvider>
              <PurchaseProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/admin/Dashboard"
                      element={
                        <RequireAdmin>
                          <Dashboard />
                        </RequireAdmin>
                      }
                    > 
                    {/* This will allow the nested views! */}
                      <Route index element={<UserList />} />
                      <Route path="PropertyList" element={<PropertyList />} />
                      <Route path="UserList" element={<UserList />} />
                    </Route>
                    <Route path="/search" element={<SearchResultDisplay />} />
                    <Route path="/listings" element={<UserPropertyList />} />
                    <Route path="/favorites" element={<FavoritesList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/offers" element={<ViewOffers />} />
                  </Routes>
                </Router>
              </PurchaseProvider>
            </OfferProvider>
          </FavoritesProvider>
        </OwnerProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
