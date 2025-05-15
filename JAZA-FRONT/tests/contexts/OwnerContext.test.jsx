
import { reducer, initialState, OwnerActionTypes } from "../../src/pages/context/OwnerContext";

describe("owner reducer", () => {
  it("returns the current state for default action types", () => {
    const prevState = { ...initialState, loading: true, error: "oops" };
    const result = reducer(prevState, { type: "DEFAULT" });
    expect(result).toEqual(prevState);
  });

  it("handles FETCH_START", () => {
    const prevState = { ...initialState, loading: false, error: "some error" };
    const action = { type: OwnerActionTypes.FETCH_START };
    const result = reducer(prevState, action);
    expect(result).toEqual({ ...initialState, loading: true, error: null });
  });

  it("handles FETCH_OWNER_SUCCESS", () => {
    const fakeOwner = { id: "owner123", name: "UserName" };
    const action = {
      type: OwnerActionTypes.FETCH_OWNER_SUCCESS,
      payload: fakeOwner,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedOwner: fakeOwner,
    });
  });

  it("handles FETCH_ERROR", () => {
    const errorMsg = "Network failure";
    const action = {
      type: OwnerActionTypes.FETCH_ERROR,
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
