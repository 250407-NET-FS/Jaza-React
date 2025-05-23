import { createContext, useReducer, useContext, useCallback } from "react";
import { api } from "../services/api";
import React from "react";

const initialState = {
    offerList: [],
    selectedOffer: {},
    loading: false,
    error: null
};
// These action types should be exclusive for offer requests
export const OfferActionTypes = {
    REQUEST_START: "REQUEST_START",
    FETCH_LIST_SUCCESS: "FETCH_LIST_SUCCESS",
    FETCH_OFFER_SUCCESS: "FETCH_OFFER_SUCCESS",
    CREATE_OFFER_SUCCESS: "CREATE_OFFER_SUCCESS",
    REQUEST_ERROR: "REQUEST_ERROR"
};

export const reducer = (state, action) => {
    switch (action.type) {
        case OfferActionTypes.REQUEST_START:
            return {...state, loading: true, error: null};
        case OfferActionTypes.FETCH_LIST_SUCCESS:
            return {...state, loading: false, offerList: action.payload};
        case OfferActionTypes.FETCH_OFFER_SUCCESS:
            return {...state, loading: false, selectedOffer: action.payload};
        case OfferActionTypes.CREATE_OFFER_SUCCESS:
            return {...state, loading: false, selectedOffer: action.payload};
        case OfferActionTypes.REQUEST_ERROR:
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

const OfferContext = createContext();

export function OfferProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    // Fetch all offers
    const fetchOfferList = useCallback(async() => {
        dispatch({type: OfferActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllOffers() method
        try {
            await api.get("offer")
            .then(res => res.data)
            .then(data => dispatch({type: OfferActionTypes.FETCH_LIST_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: OfferActionTypes.REQUEST_ERROR, error: err.message});
        }
    }, []);
    // Obtain the selected offer info when browsing full details
    const fetchOffer = useCallback(async(id) => {
        dispatch({type: OfferActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetOfferById() method
        try {
            await api.get(`offer/${id}`)
            .then(res => res.data)
            .then(data => dispatch({type: OfferActionTypes.FETCH_OFFER_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: OfferActionTypes.REQUEST_ERROR, error: err.message});
        }
    }, []);
    // Obtain a filtered list of offers from a particular user
    const fetchUserOffers = useCallback(async(userId) => {
        dispatch({type: OfferActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllOffersFromUser() method
        try {
            await api.get(`offer/user/${userId}`)
            .then(res => res.data)
            .then(data => dispatch({type: OfferActionTypes.FETCH_LIST_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: OfferActionTypes.REQUEST_ERROR, error: err.message});
        }
    }, []);
    // Obtain a filtered list of offers associated with a particular property
    const fetchPropertyOffers = useCallback(async(propertyId) => {
        dispatch({type: OfferActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllOffersForProperty() method
        try {
            await api.get(`offer/property/${propertyId}`)
            .then(res => res.data)
            .then(data => dispatch({type: OfferActionTypes.FETCH_LIST_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: OfferActionTypes.REQUEST_ERROR, error: err.message});
        }
    }, []);
    // Create an offer for a property the user selects to buy
    const makeOffer = useCallback(async(offerDTO) => {
        dispatch({type: OfferActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's CreateOffer() method
        try {
            await api.post("offer", offerDTO)
            .then(res => res.data)
            .then(data => {
                dispatch({type: OfferActionTypes.CREATE_OFFER_SUCCESS, payload: data});
                fetchOfferList();
            });
        }
        catch (err) {
            dispatch({type: OfferActionTypes.REQUEST_ERROR, error: err.message});
            return false;
        }
        return true;
    }, []);

    return (
        <OfferContext.Provider
            value={{
                ...state,
                fetchOfferList,
                fetchOffer,
                fetchUserOffers,
                fetchPropertyOffers,
                makeOffer
            }}
        >
            {children}
        </OfferContext.Provider>
    );
}

// export const useOffer = () => {
//     const offerContext = useContext(OfferContext);

//     if (!offerContext) {
//         throw new Error("useOffer must be used within an OfferProvider");
//     }

//     return offerContext;
// };

export const useOffer = () => useContext(OfferContext);