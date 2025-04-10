import * as actionTypes from "../constants/orderConstants";

export const getOrdersReducer = (state = { orderDetailsArray: [] }, action) => {
  switch (action.type) {
    case actionTypes.GET_ORDERS_REQUEST:
      return {
        loading: true,
        orderDetailsArray: [],
      };
    case actionTypes.GET_ORDERS_SUCCESS:
      return {
        orderDetailsArray: action.payload,
        loading: false,
      };
    case actionTypes.GET_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};