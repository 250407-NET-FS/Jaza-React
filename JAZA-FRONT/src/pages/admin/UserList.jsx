import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const { user: admin } = useAuth();

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    api
      .get("http://localhost:5236/api/user/admin")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const banHandler = (userId) => {
    api
      .post(`http://localhost:5236/api/user/admin/ban/${userId}`)
      .then((res) => {
        const updatedUser = res.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id
              ? { ...user, lockoutEnabled: true }
              : user
          )
        );
      })
      .catch((err) => console.error("Ban failed: ", err.message));
  };

  const unbanHandler = (userId) => {
    console.log("Sending unban request for:", userId);
    api
      .post(`http://localhost:5236/api/user/admin/unban/${userId}`)
      .then((res) => {
        const updatedUser = res.data;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id
              ? { ...user, lockoutEnabled: false }
              : user
          )
        );
      })
      .catch((err) => console.error("Unban failed: ", err.message));
  };

  const deleteHandler = (userId) => {
    api
      .delete(`http://localhost:5236/api/user/admin/${userId}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      })
      .catch((err) => console.error("Delete failed ", err.message));
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center">User List</h1>
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <UserCard
              key={u.id}
              name={u.fullName}
              id={u.id}
              email={u.email}
              lockoutEnabled={u.lockoutEnabled}
              isAdmin={
                u.id === admin.id
              } /*going to need to consume conext here*/
              banHandler={() => banHandler(u.id)}
              unbanHandler={() => unbanHandler(u.id)}
              deleteHandler={() => deleteHandler(u.id)}
            ></UserCard>
          ))}
        </ul>
      </div>
      {/* Add a search bar here
    then create a card with that single user that is searched if found
    
    */}
    </>
  );
}

function UserCard({
  name,
  id,
  email,
  lockoutEnabled,
  isAdmin,
  banHandler,
  unbanHandler,
  deleteHandler,
}) {
  return (
    //TODO TEST IF ADMIN DOES NOT SHOW WITH THOSE OPTIONS
    <li className="card">
      <h4>{name}</h4>
      <p>Id: {id}</p>
      <p>Email: {email}</p>
      {!isAdmin && (
        <>
          {lockoutEnabled ? (
            <button onClick={unbanHandler}>Unban</button>
          ) : (
            <button onClick={banHandler}>Ban</button>
          )}
          <button onClick={deleteHandler}>Delete</button>
        </>
      )}
    </li>
  );
}

export default UserList;
