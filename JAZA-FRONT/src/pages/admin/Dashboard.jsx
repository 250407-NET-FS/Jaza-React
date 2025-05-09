import React from "react";
import { useEffect, useContext, } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="Admin-Layout">
      <h1 className="display-4">Welcome Admin!</h1>
      <div className="container">
        <ul
          style={{ display: "flex", listStyle: "none", padding: 0 }}
          className="Admin-Options"
        >
          <li style={{ marginRight: "20px" }}>
            <Link to="/UserList">View all Users</Link>
          </li>
          <li className="col-6">
            <Link to="/PropertyList">View All Properties</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
