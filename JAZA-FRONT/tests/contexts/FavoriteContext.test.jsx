import { reducer, initialState, FavoritesActionTypes } from "../../src/pages/context/FavoritesContext";

describe("favorites reducer", () => {
  it("returns the current state for default action types", () => {
    const result = reducer(initialState, { type: "DEFAULT" });
    expect(result).toEqual(initialState);
  });

  it("should handle REQUEST_START", () => {
    const action = { type: FavoritesActionTypes.REQUEST_START };
    const result = reducer(
      { ...initialState, loading: false, error: "prev" },
      action
    );
    expect(result).toEqual({ ...initialState, loading: true, error: null });
  });

  it("should handle FETCH_LIST_SUCCESS", () => {
    const fakeList = [{ id: 1 }, { id: 2 }];
    const action = {
      type: FavoritesActionTypes.FETCH_LIST_SUCCESS,
      payload: fakeList,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({ ...initialState, loading: false, favoritesList: fakeList });
  });

  it("should handle FETCH_BOOKMARK_SUCCESS", () => {
    const fakeItem = { id: 42 };
    const action = {
      type: FavoritesActionTypes.FETCH_BOOKMARK_SUCCESS,
      payload: fakeItem,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      foundFavorite: fakeItem,
    });
  });

  it("should handle CREATE_FAVORITE_SUCCESS", () => {
    const newFavorite = { id: 250407 };
    const action = {
      type: FavoritesActionTypes.CREATE_FAVORITE_SUCCESS,
      payload: newFavorite,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      foundFavorite: newFavorite,
    });
  });

  it("should handle REQUEST_ERROR", () => {
    const error = "Something went wrong";
    const action = {
      type: FavoritesActionTypes.REQUEST_ERROR,
      payload: error,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({ ...initialState, loading: false, error });
  });
});
