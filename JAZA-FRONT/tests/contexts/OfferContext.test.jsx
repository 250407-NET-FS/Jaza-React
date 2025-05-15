import { reducer, initialState, OfferActionTypes } from "../../src/pages/context/OfferContext";

describe("offer reducer", () => {
  it("returns the current state for default action types", () => {
    const prevState = { ...initialState, loading: true, error: "oops" };
    const result = reducer(prevState, { type: "DEFAULT" });
    expect(result).toEqual(prevState);
  });

  it("handles REQUEST_START", () => {
    const prevState = { ...initialState, loading: false, error: "err" };
    const action = { type: OfferActionTypes.REQUEST_START };
    const result = reducer(prevState, action);
    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it("handles FETCH_LIST_SUCCESS", () => {
    const fakeList = [{ id: 1 }, { id: 2 }];
    const action = {
      type: OfferActionTypes.FETCH_LIST_SUCCESS,
      payload: fakeList
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      offerList: fakeList
    });
  });

  it("handles FETCH_OFFER_SUCCESS", () => {
    const fakeOffer = { id: 250407, price: 1000 };
    const action = {
      type: OfferActionTypes.FETCH_OFFER_SUCCESS,
      payload: fakeOffer
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedOffer: fakeOffer
    });
  });

  it("handles CREATE_OFFER_SUCCESS by appending to offerList and setting selectedOffer", () => {
    const existing = { id: 1 };
    const newOffer = { id: 250407, price: 500 };
    const prevState = { ...initialState, offerList: [existing], loading: true };
    const action = {
      type: OfferActionTypes.CREATE_OFFER_SUCCESS,
      payload: newOffer
    };
    const result = reducer(prevState, action);
    expect(result.loading).toBe(false);
    expect(result.selectedOffer).toEqual(newOffer);
    expect(result.offerList).toEqual([existing, newOffer]);
  });

  it("handles REQUEST_ERROR", () => {
    const errorMsg = "Network failure";
    const action = {
      type: OfferActionTypes.REQUEST_ERROR,
      payload: errorMsg
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMsg
    });
  });
});
