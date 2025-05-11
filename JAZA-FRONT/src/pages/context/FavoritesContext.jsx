import { createContext, useReducer, useContext, useCallback } from "react";
import axios from "axios";
import { data } from "react-router-dom";

const initialState = {
    favoritesList: [],
    foundFavorite: null,
    loading: false,
    error: null
};
// These action types are exclusive for favorites requests
const FavoritesActionTypes = {
    REQUEST_START: "REQUEST_START",
    FETCH_LIST_SUCCESS: "FETCH_LIST_SUCCESS",
    FETCH_BOOKMARK_SUCCESS: "FETCH_BOOKMARK_SUCCESS",
    CREATE_FAVORITE_SUCCESS: "BOOKMARK_INTERACT_SUCCESS",
    REQUEST_ERROR: "REQUEST_ERROR"
};

const reducer = (action, state) => {
    switch (action.type) {
        case FavoritesActionTypes.REQUEST_START:
            return {...state, loading: true, error: null};
        case FavoritesActionTypes.FETCH_LIST_SUCCESS:
            return {...state, loading: false, favoritesList: action.payload};
        case FavoritesActionTypes.FETCH_BOOKMARK_SUCCESS:
            return {...state, loading: false, foundFavorite: action.payload};
        case FavoritesActionTypes.CREATE_FAVORITE_SUCCESS:
            if (state.favoritesList.some(action.payload)) {
                state.favoritesList.delete(action.payload);
            }
            else {
                state.favoritesList = state.favoritesList.map(f => f.FavoriteID != action.payload.FavoriteID);
            }
            return {...state, loading: false, foundFavorite: action.payload};
        case FavoritesActionTypes.REQUEST_ERROR:
            return {...state, loading: false, error: action.payload};
    }
};

const FavoritesContext = createContext();

export function FavoritesProvider([children]) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Obtain the full list of favorited properties for the logged user
    const fetchFavoritesList = useCallback(async() => {
        dispatch({type: FavoritesActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's GetAllFavorites() to our state
        try {
            await axios.get("http://localhost:5236/api/favorites")
            .then(res => res.json)
            .then(data => dispatch({type: FavoritesActionTypes.FETCH_LIST_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: FavoritesActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // Determine whether a property is favorited when selected
    const fetchCurrentFavorite = useCallback(async(propertyId) => {
        dispatch({type: FavoritesActionTypes.REQUEST_START});
        // Try to fetch and pass the results of controller's CheckIfFavorited() to our state
        try {
            await axios.get("http://localhost:5236/api/favorites/{id}")
            .then(res => res.json)
            .then(data => dispatch({type: FavoritesActionTypes.FETCH_BOOKMARK_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: FavoritesActionTypes.REQUEST_ERROR, payload: err.message});
        }
    }, []);
    // (Usually) Post a new favorite to the list of marked listings
    const markFavorite = useCallback(async(favoriteDTO) => {
        dispatch({type: FavoritesActionTypes.REQUEST_START});
        // Try to create and pass the results of controller's MarkUnmarkFavorite() to our state
        try {
            await axios.post("http://localhost:5236/api/favorites", favoriteDTO)
            .then(res => res.json)
            .then(data => dispatch({type: FavoritesActionTypes.FETCH_BOOKMARK_SUCCESS, payload: data.results}));
        }
        catch (err) {
            dispatch({type: FavoritesActionTypes.REQUEST_ERROR, payload: err.message});
        }       
    }, []);

    return (
        <FavoritesContext.Provider
            value={{
                ...state,
                fetchFavoritesList,
                fetchCurrentFavorite,
                markFavorite
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorite = () => {
    const favoritesContext = useContext(FavoritesContext);

    if (!favoritesContext) {
        throw new Error("useFavorite must be used within a FavoritesProvider");
    }

    return favoritesContext;
};

export {reducer, initialState, FavoritesActionTypes};