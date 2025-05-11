import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // or './Home' if not in a folder
import Dashboard from "./pages/admin/Dashboard";
import PropertyList from "./pages/admin/PropertyList";
import UserList from "./pages/admin/UserList";
import { AuthProvider } from "./pages/context/AuthContext";
import { PropertyProvider } from "./pages/context/PropertyContext";
import UserPropertyList from "./pages/properties/UserPropertyList";

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/admin/Dashboard" element={<Dashboard />} />
            <Route path="/UserList" element={<UserList />} />
            <Route path="/listings" element={<UserPropertyList />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
