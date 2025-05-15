
import { reducer, initialState, PropertyActionTypes } from "../../src/pages/context/PropertyContext";

describe("property reducer", () => {
  it("returns the current state for default action types", () => {
    const prevState = { ...initialState, loading: true, error: "prevError" };
    const result = reducer(prevState, { type: "DEFAULT" });
    expect(result).toEqual(prevState);
  });

  it("handles REQUEST_START", () => {
    const prevState = { ...initialState, loading: false, error: "oops" };
    const action = { type: PropertyActionTypes.REQUEST_START };
    const result = reducer(prevState, action);
    expect(result).toEqual({ ...initialState, loading: true, error: null });
  });

  it("handles FETCH_LIST_SUCCESS", () => {
    const list = [{ id: 1 }, { id: 2 }];
    const action = {
      type: PropertyActionTypes.FETCH_LIST_SUCCESS,
      payload: list,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      propertyList: list,
    });
  });

  it("handles FETCH_SEARCH_SUCCESS", () => {
    const searchResults = [{ id: 25 }, { id: 407 }];
    const action = {
      type: PropertyActionTypes.FETCH_SEARCH_SUCCESS,
      payload: searchResults,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      propertyList: searchResults,
    });
  });

  it("handles FETCH_PROPERTY_SUCCESS", () => {
    const property = { id: 42, name: "Test Property" };
    const action = {
      type: PropertyActionTypes.FETCH_PROPERTY_SUCCESS,
      payload: property,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedProperty: property,
    });
  });

  it("handles CREATE_PROPERTY_SUCCESS", () => {
    const newProp = { id: 100, name: "New Prop" };
    const prevState = { ...initialState, loading: true, propertyList: [{ id: 1 }] };
    const action = {
      type: PropertyActionTypes.CREATE_PROPERTY_SUCCESS,
      payload: newProp,
    };
    const result = reducer(prevState, action);
    expect(result).toEqual({
      ...prevState,
      loading: false,
      selectedProperty: newProp,
    });
  });

  it("handles UPDATE_PROPERTY_SUCCESS", () => {
    const updated = { id: 1, name: "Updated Name" };
    const action = {
      type: PropertyActionTypes.UPDATE_PROPERTY_SUCCESS,
      payload: updated,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedProperty: updated,
    });
  });

  it("handles DELETE_PROPERTY_SUCCESS", () => {
    const deleted = { id: 2 };
    const action = {
      type: PropertyActionTypes.DELETE_PROPERTY_SUCCESS,
      payload: deleted,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedProperty: deleted,
    });
  });

  it("handles REQUEST_ERROR", () => {
    const errorMsg = "Failed to fetch";
    const action = {
      type: PropertyActionTypes.REQUEST_ERROR,
      payload: errorMsg,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMsg,
    });
  });
});
