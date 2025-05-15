import { createContext, useReducer, useContext, act, useCallback } from "react";
import { api } from "../services/api";

const initialState = {
    purchaseList: [],
    selectedPurchase: {},
    loading: false,
    error: null
};
// These action types are exclusive for purchase requests
const PurchaseActionTypes = {
    REQUEST_START: "REQUEST_START",
    FETCH_LIST_SUCCESS: "FETCH_LIST_SUCCESS",
    ACCEPT_OFFER_SUCCESS: "ACCEPT_OFFER_SUCCESS",
    REQUEST_ERROR: "REQUEST_ERROR"
};

const reducer = (state, action) => {
    switch (action.type) {
        case PurchaseActionTypes.REQUEST_START:
            return {...state, loading: true, error: null};
        case PurchaseActionTypes.FETCH_LIST_SUCCESS:
            return {...state, loading: false, purchaseList: action.payload};
        case PurchaseActionTypes.ACCEPT_OFFER_SUCCESS:
            return {...state, loading: false, selectedPurchase: action.payload};
        case PurchaseActionTypes.REQUEST_ERROR:
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

const PurchaseContext = createContext();

export function PurchaseProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Obtain all transactions from a certain user
    const fetchUserPurchases = useCallback(async() => {
        dispatch({type: PurchaseActionTypes.REQUEST_START});
        // Try to fetch and pass the results of GetAllPurchasesByUser() to our state
        try {
            await api.get("purchase/user")
            .then(res => res.data)
            .then(data => dispatch({type: PurchaseActionTypes.FETCH_LIST_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: PurchaseActionTypes.REQUEST_ERROR, error: err.message});
        }
    }, []);
    // Accept the Offer Info
    const acceptOffer = useCallback(async (purchaseInfo) => {
        dispatch({type: PurchaseActionTypes.REQUEST_START});
        // Try to fetch and pass the results of AcceptOffer(CreateResponseDTO) to our state
        try {
            await api.post("", purchaseInfo)
            .then(res => res.data)
            .then(data => dispatch({type: PurchaseActionTypes.ACCEPT_OFFER_SUCCESS, payload: data}));
        }
        catch (err) {
            dispatch({type: PurchaseActionTypes.REQUEST_ERROR, error: err.message});
        }        
    }, []);

    return (
        <PurchaseContext.Provider
            value={{
                ...state,
                fetchUserPurchases,
                acceptOffer
            }}
        >
            {children}
        </PurchaseContext.Provider>
    );
}

export const usePurchase = () => {
    const purchaseContext = useContext(PurchaseContext);

    if (!ownerContext) {
        throw new Error("usePurchase must be used within a PurchaseProvider");
    }

    return purchaseContext;
}

export {reducer, initialState, PurchaseActionTypes};