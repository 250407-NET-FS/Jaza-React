import React, { useEffect, useState } from "react";
//import '.../App.css';

function UserList() {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    fetch("http://localhost:5236/user/admin")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">User List</h1>
      <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <UserCard
            key={u.id}
            name={u.fullName}
            id={u.id}
            phone={u.phone ?? "Not Registered"}
            isBanned={u.isBanned}
            role={u.role}
            setUsers={setUsers} //i can refactor if you want
          ></UserCard>
        ))}
      </ul>
    </div>
  );
}

function UserCard({ name, id, phone, isBanned, role, setUsers }) {
  const banHandler = (userId) => {
    fetch(`http://localhost:5236/user/admin/ban/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ban failed");
        return res.json();
      })
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, isBanned: true } : user
          )
        );
      })
      .catch((err) => console.error(err.message));
  };

  const unBanHandler = (userId) => {
    fetch(`http://localhost:5236/user/admin/unban/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unban failed");
        return res.json();
      })
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, isBanned: false } : user
          )
        );
      })
      .catch((err) => console.error(err.message));
  };

  const deleteHandler = (userId) => {
    fetch(`http://localhost:5236/user/admin/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ban failed");
        return res.json();
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u.id !== userId));

      })
      .catch((err) => console.error(err.message));
  };

  return (
    //TODO TEST IF ADMIN DOES NOT SHOW WITH THOSE OPTIONS
    <div className="card">
      <h4>{name}</h4>
      <p>Id {id}</p>
      <p>Phone:{phone}</p>
      {!role?.includes("Admin") && (
        <>
          {isBanned ? (
            <button onClick={() => unBanHandler(id)}>Unban</button>
          ) : (
            <button onClick={() => banHandler(id)}>Ban</button>
          )}
          <button onClick={() => deleteHandler(id)}>Delete</button>
        </>
      )}

      {role?.includes("Admin") === false && (
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => deleteHandler(id)}
        >
          Delete user
        </button>
      )}
    </div>
  );
}

export default UserList;
