import React, { useState, useEffect } from 'react'

function PropertyList() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5236/api/properties/admin")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error(err));
  }, []);


  return (
    <>
    <div className="container">
      <h1 className="text-center">Property List</h1>
      <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
        {properties.map((p) => (
          <PropertyCard
            key={p.propertyID}
            id={p.propertyID}
            address={p.address} 
            startingPrice={p.startingPrice}
            ownerName={p.ownerFullName}
            ownerId={p.ownerID}

            setProperties={setProperties} //i can refactor if you want
          ></PropertyCard>
        ))}
      </ul>
    </div>
    </>
  )
}

function PropertyCard({id, address, startingPrice, ownerName, ownerId, setProperties }) {
  // const banHandler = (userId) => {
  //   fetch(`http://localhost:5236/api/user/admin/ban/${userId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Ban failed");
  //       return res.json();
  //     })
  //     .then((updatedUser) => {
  //       setUsers((prevUsers) =>
  //         prevUsers.map((user) =>
  //           user.id === updatedUser.id ? { ...user, isBanned: true } : user
  //         )
  //       );
  //     })
  //     .catch((err) => console.error(err.message));
  // };

  // const unBanHandler = (userId) => {
  //   fetch(`http://localhost:5236/api/user/admin/unban/${userId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Unban failed");
  //       return res.json();
  //     })
  //     .then((updatedUser) => {
  //       setUsers((prevUsers) =>
  //         prevUsers.map((user) =>
  //           user.id === updatedUser.id ? { ...user, isBanned: false } : user
  //         )
  //       );
  //     })
  //     .catch((err) => console.error(err.message));
  // };

  const deleteHandler = (propertyId, ownerId) => {
    fetch(`http://localhost:5236/api/properties/admin/${propertyId}/${ownerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
      })
      .then(() => {
        setProperties((prevPropeties) =>
          prevPropeties.filter((p) => p.propertyID !== propertyId));
      })
      .catch((err) => console.error(err.message));
  };

  return ( 
    //TODO TEST IF ADMIN DOES NOT SHOW WITH THOSE OPTIONS
    <li className="card">
      <h4>{id}</h4>
      <p>Address: {address}</p>
      <p>StartingPrice :{startingPrice}</p>
      <p>Owner: {ownerName}</p> {/*Need to make it so we can go to that view imediatly and then choose to ban or not */}
      <p>Owner Id: {ownerId}</p>
      <button onClick={() => deleteHandler(id, ownerId)}>Delete</button>
    </li>
  );
}

export default PropertyList