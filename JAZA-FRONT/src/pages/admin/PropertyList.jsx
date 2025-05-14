import React, { useState, useEffect } from "react";
import { api } from "../services/api";

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    api
      .get("http://localhost:5236/api/properties/admin")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteHandler = (propertyId, ownerId) => {
    api
      .delete(
        `http://localhost:5236/api/properties/admin/${propertyId}/${ownerId}`)
      .then((res) => {
        setProperties((prevPropeties) =>
          prevPropeties.filter((p) => p.propertyID !== propertyId)
        );
      })
      .catch((err) => console.error("Delete failed", err));
  };

  return (
    <>
      <div className="container">
        <h1 className="admin-options">Property List</h1>
        <ul className="cards" style={{listStyle: "none"}}>
          {properties.map((p) => (
            <PropertyCard
              key={p.propertyID}
              id={p.propertyID}
              address={p.address}
              startingPrice={p.startingPrice}
              ownerName={p.ownerFullName}
              ownerId={p.ownerID}
              deleteHandler={() => deleteHandler(p.propertyID, p.ownerID)}
            ></PropertyCard>
          ))}
        </ul>
      </div>
    </>
  );
}

function PropertyCard({
  id,
  address,
  startingPrice,
  ownerName,
  ownerId,
  deleteHandler,
}) {
  return (
    <li className="card">
      <h4>{id}</h4>
      <p>Address: {address}</p>
      <p>StartingPrice :{startingPrice}</p>
      <p>Owner: {ownerName}</p>{" "}
      {/*Need to make it so we can go to that view imediatly and then choose to ban or not */}
      <p>Owner Id: {ownerId}</p>
      <div className="button-group">
      <button onClick={deleteHandler}>Delete</button>
      </div>
    </li>
  );
}

export default PropertyList;
