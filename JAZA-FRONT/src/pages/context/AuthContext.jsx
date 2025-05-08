import { createContext, useContext, useReducer, useEffect, Children } from "react";


import { jwtDecode } from "jwtDecode";
import { api } from "../services/auth-api";

const AuthContext = createContext();

const normalizeClaims = (decoded) => ({
  email:
    decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ],
  id: decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ],
  role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
});

const authReducer = (state, action) => {
    switch(action.type){
        case "LOGIN":
            return {...state, user: action.payload, isAuthenticated: true};
        case "LOGOUT":
            return {...state, user: null, isAuthenticated: false};
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false
    });


    const checkTokenValidity = () => {


    }
}
