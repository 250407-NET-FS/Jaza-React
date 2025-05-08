import { createContext, useContext, useReducer, useEffect, Children } from "react";


import jwtDecode from "jwt-decode";
import { api } from "../services/api";

const AuthContext = createContext();

// cleans up claims to nice and neat strings
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

// finite state machine for authContext
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

// main component
export const AuthProvider = ({ children }) => {
    // initialize default state values
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false
    });

    // function to check if token exists and is not expired
    const checkTokenValidity = () => {
        // accesses localstorage to get token
        const token = localStorage.getItem("jwt");
        if(!token){
            return false;
        }
        try{
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch(error){
            return false;
        }
    };

    // function to handle login action
    const login = async (credentials) => {
        // sends post request to api service with base url attached to front and
        // credentials attached to body
        const response = await api.post("auth/login", credentials);
        const token = response.data.token;
        // assigns token to localStorage
        localStorage.setItem("jwt", token);
        const decoded = jwtDecode(token);
        dispatch({type: "LOGIN", payload: normalizeClaims(decoded)});
        return true;
    };

    // function to handle logout action
    const logout = () => {
        localStorage.removeItem("jwt");
        dispatch({type: "LOGOUT"});
    };

    // user should remain logged in when page refreshes
    // useEffect triggers once when component is mounting
    // simply checks if the user has a valid token and
    // logs the user in if they do
    useEffect(() => {
        if(checkTokenValidity()){
            const token = localStorage.getItem("jwt");
            const decode = jwtDecode(token);
            dispatch({type: "LOGIN", payload: normalizeClaims(decode)});
        }
    }, []);

    return(
        <AuthContext.Provider
            value = {{...state, login, logout, checkTokenValidity}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
