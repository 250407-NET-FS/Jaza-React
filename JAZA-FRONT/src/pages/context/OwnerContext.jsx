import { createContext, useReducer, useContext, act, useCallback } from "react";
import axios from "axios";
import { data } from "react-router-dom";
import { api } from "../services/api";

const initialState = {
    selectedOwner: {},
    loading: false,
    error: null
};
// These action types are exclusive for non-admin user requests
const OwnerActionTypes = {
    FETCH_START: "FETCH_START",
    FETCH_OWNER_SUCCESS: "FETCH_OWNER_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR"
}

const reducer = (state, action) => {
    switch(action.type) {
        case OwnerActionTypes.FETCH_START:
            return {...state, loading: true, error: null};
        case OwnerActionTypes.FETCH_OWNER_SUCCESS:
            return {...state, loading: false, selectedOwner: action.payload};
        case OwnerActionTypes.FETCH_ERROR:
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

const OwnerContext = createContext();

export function OwnerProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Obtain a specific owner using a property's owner id 
    const fetchLoggedOwner = useCallback(async () => {
        dispatch({type: OwnerActionTypes.FETCH_START});
        // Try and fetch the results of GetUserById()
        try {
            await api.get(`user`)
            .then(res => res.data)
            .then(data => dispatch({type: OwnerActionTypes.FETCH_OWNER_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: OwnerActionTypes.FETCH_ERROR, error: err.message});
        }
    }, []);

    return (
        <OwnerContext.Provider
            value={{
                ...state,
                fetchLoggedOwner
            }}
        >
            {children}
        </OwnerContext.Provider>
    )
}

export const useOwner = () => {
    const ownerContext = useContext(OwnerContext);

    if (!ownerContext) {
        throw new Error("useOwner must be used within a OwnerProvider");
    }

    return ownerContext;
};

export {reducer, initialState, OwnerActionTypes};