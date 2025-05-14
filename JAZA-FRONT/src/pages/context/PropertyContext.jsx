import { createContext, useReducer, useContext, act, useCallback } from "react";
import axios from "axios";
import { api } from "../services/api";

const initialState = {
    propertyList: [],
    selectedProperty: null,
    loading: false,
    error: null
};
// These action types should be exclusive for property requests
const PropertyActionTypes = {
    REQUEST_START: "REQUEST_START",
    FETCH_LIST_SUCCESS: "FETCH_LIST_SUCCESS",
    FETCH_SEARCH_SUCCESS: "FETCH_SEARCH_SUCCESS",
    FETCH_PROPERTY_SUCCESS: "FETCH_PROPERTY_SUCCESS",
    CREATE_PROPERTY_SUCCESS: "CREATE_PROPERTY_SUCCESS",
    UPDATE_PROPERTY_SUCCESS: "UPDATE_PROPERTY_SUCCESS",
    DELETE_PROPERTY_SUCCESS: "DELETE_PROPERTY_SUCCESS",
    REQUEST_ERROR: "REQUEST_ERROR"
};

const reducer = (state, action) => {
    switch (action.type) {
        case PropertyActionTypes.REQUEST_START: 
            return {...state, loading: true, error: null};
        case PropertyActionTypes.FETCH_LIST_SUCCESS:
            return {...state, loading: false, propertyList: action.payload};
        case PropertyActionTypes.FETCH_SEARCH_SUCCESS:
            return {...state, loading: false, propertyList: action.payload};
        case PropertyActionTypes.FETCH_PROPERTY_SUCCESS:
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.CREATE_PROPERTY_SUCCESS:
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.UPDATE_PROPERTY_SUCCESS:
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.DELETE_PROPERTY_SUCCESS:
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.REQUEST_ERROR:
            return {...state, loading: false, error: action.payload}
        default:
            return state;
    }
}

const PropertyContext = createContext();

export function PropertyProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Obtain the full list of properties for the homepage and property list (non-admin)
    const fetchPropertyList = useCallback(async () => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllProperties() to our state
        try {
            await api.get("properties")
            .then(res => res.data)
            .then(data => dispatch({type: PropertyActionTypes.FETCH_LIST_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Obtain a list of properties within 500 meters of a specific property (non-admin)
    const fetchSearchList = useCallback(async (id) => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllPropertiesWithinDistOf() to our state
        try {
            await api.get(`properties/distance/${id}`)
            .then(res => res.data)
            .then(data => dispatch({type: PropertyActionTypes.FETCH_SEARCH_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Obtain a specific property after selecting it from a property list
    const fetchProperty = useCallback(async (id) => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetPropertyById() to our state
        try {
            await api.get(`properties/${id}`)
            .then(res => res.data)
            .then(data => dispatch({type: PropertyActionTypes.FETCH_PROPERTY_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Create a property in the app's "create property page"
    const createProperty = useCallback(async (propertyInfo) => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        //fetch coords from google api
        try{
            const response = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${property.streetAddress}&key=AIzaSyDf5j82IEnLq-X8TEtqbfWe12mp6ThG-8c`);
            const data = response.results[0];

            property.latitude = data.geometry.location.lat;
            property.longitude = data.geometry.location.lng;

            console.log("successfully fetched coordinates");

        } catch(error){
            console.log("Failed to fetch coordinates");
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
            return false;
        }
        // Try to create and pass the results of controller's CreateProperty() to our state
        try {
            await api.post("properties", propertyInfo)
            .then(res => res.data)
            .then(data => {
                dispatch({type: PropertyActionTypes.CREATE_PROPERTY_SUCCESS, payload: data});
                fetchPropertyList(); // Sync property List
                return data;
            });
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Update a property in the app's "update property page"
    const updateProperty = useCallback(async (propertyInfo) => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to update and pass the results of controller's UpdateProperty() to our state
        try {
            await api.put("properties", propertyInfo)
            .then(res => res.data)
            .then(data => {
                dispatch({type: PropertyActionTypes.UPDATE_PROPERTY_SUCCESS, payload: data});
                fetchPropertyList();
                return data;
            });
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Delete a property in the owner's property list
    const deleteProperty = useCallback(async (id) => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to update and pass the results of controller's DeleteProperty() to our state
        try {
            await api.delete(`properties/${id}`)
            .then(res => res.data)
            .then(data => {
                dispatch({type: PropertyActionTypes.DELETE_PROPERTY_SUCCESS, payload: data});
                fetchPropertyList();
            });
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);

    return (
        <PropertyContext.Provider
            value={{
                ...state,
                fetchPropertyList,
                fetchSearchList,
                fetchProperty,
                createProperty,
                updateProperty,
                deleteProperty
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
}

export const useProperty = () => {
    const propertyContext = useContext(PropertyContext);

    if (!propertyContext) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }

    return propertyContext;
};

export {reducer, initialState, PropertyActionTypes}