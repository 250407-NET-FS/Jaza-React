import { createContext, useReducer, useContext, act, useCallback } from "react";
import axios from "axios";

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
        case PropertyActionTypes.FETCH_PROPERTY_SUCCESS:
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.CREATE_PROPERTY_SUCCESS:
            state.propertyList.push(action.payload);
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.UPDATE_PROPERTY_SUCCESS:
            state.propertyList[state.propertyList.findIndex(p => p.PropertyId = action.payload.PropertyId)] = action.payload;
            return {...state, loading: false, selectedProperty: action.payload};
        case PropertyActionTypes.DELETE_PROPERTY_SUCCESS:
            return {...state, loading: false, propertyList: propertyList.map(p => p.id != action.payload.PropertyId), selectedProperty: action.payload};
        case PropertyActionTypes.REQUEST_ERROR:
            return {...state, loading: error, error: action.payload}
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
            await axios.get("api/properties")
            .then(res => res.json)
            .then(data => dispatch({type: PropertyActionTypes.FETCH_LIST_SUCCESS, payload: data.results}));
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
            await axios.get(`api/properties/id/${id}`)
            .then(res => res.json)
            .then(data => dispatch({type: PropertyActionTypes.FETCH_PROPERTY_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Create a property in the app's "create property page"
    const createProperty = useCallback(async () => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to create and pass the results of controller's CreateProperty() to our state
        try {
            await axios.post("api/properties")
            .then(res => res.json)
            .then(data => dispatch({type: PropertyActionTypes.CREATE_PROPERTY_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: PropertyActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Update a property in the app's "update property page"
    const updateProperty = useCallback(async () => {
        dispatch({type: PropertyActionTypes.REQUEST_START});
        // Try to update and pass the results of controller's UpdateProperty() to our state
        try {
            await axios.put("api/properties")
            .then(res => res.json)
            .then(data => dispatch({type: PropertyActionTypes.UPDATE_PROPERTY_SUCCESS, payload: data.results}));
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
            await axios.delete(`api/properties/${id}`)
            .then(res => res.json)
            .then(data => dispatch({type: PropertyActionTypes.DELETE_PROPERTY_SUCCESS, payload: data.results}));
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