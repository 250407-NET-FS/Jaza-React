import { createContext, useReducer, useContext, act, useCallback } from "react";
import axios from "axios";
import { data } from "react-router-dom";

const initialState = {
    selectedOwner: null,
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

export function UserProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Obtain a specific owner using a property's owner id 
    const fetchUser = useCallback(async (id) => {
        dispatch({type: OwnerActionTypes.FETCH_START});
        // Try and fetch the results of GetUserByAdminId()
        try {
            await axios.get(`http://localhost:5236/api/user/admin/${id}`)
            .then(res => res.json)
            .then(data => dispatch({type: OwnerActionTypes.FETCH_OWNER_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: OwnerActionTypes.FETCH_ERROR, error: err.message});
        }
    }, []);

    return (
        <OwnerContext.Provider
            value={{
                ...state,
                fetchUser
            }}
        >
            {children}
        </OwnerContext.Provider>
    )
}

export const useUser = () => {
    const ownerContext = useContext(OwnerContext);

    if (!ownerContext) {
        throw new Error("useOwner must be used within a OwnerProvider");
    }

    return ownerContext;
};

export {reducer, initialState, OwnerActionTypes};