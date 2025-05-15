
import { reducer, initialState, PurchaseActionTypes } from "../../src/pages/context/PurchaseContext";

describe("purchase reducer", () => {
  it("returns the current state for default action types", () => {
    const prevState = { ...initialState, loading: true, error: "prevError" };
    const result = reducer(prevState, { type: "DEFAULT" });
    expect(result).toEqual(prevState);
  });

  it("handles REQUEST_START", () => {
    const prevState = { ...initialState, loading: false, error: "oops" };
    const action = { type: PurchaseActionTypes.REQUEST_START };
    const result = reducer(prevState, action);
    expect(result).toEqual({ ...initialState, loading: true, error: null });
  });

  it("handles FETCH_LIST_SUCCESS", () => {
    const purchases = [{ id: 1 }, { id: 2 }];
    const action = {
      type: PurchaseActionTypes.FETCH_LIST_SUCCESS,
      payload: purchases,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      purchaseList: purchases,
    });
  });

  it("handles ACCEPT_OFFER_SUCCESS", () => {
    const purchase = { id: 42, amount: 500 };
    const action = {
      type: PurchaseActionTypes.ACCEPT_OFFER_SUCCESS,
      payload: purchase,
    };
    const result = reducer({ ...initialState, loading: true }, action);
    expect(result).toEqual({
      ...initialState,
      loading: false,
      selectedPurchase: purchase,
    });
  });

  it("handles REQUEST_ERROR", () => {
    const errorMsg = "Network failure";
    const action = {
      type: PurchaseActionTypes.REQUEST_ERROR,
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
