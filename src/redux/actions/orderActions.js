import * as actionTypes from '../constants/orderConstants'
import {Api} from '../../utils/Api'

export const getOrderDetails = id => async dispatch => {
      dispatch({type: actionTypes.GET_ORDER_DETAILS_REQUEST})
      try {
        const { data: userOrders } = await Api.getRequest(`/orders/orders/user-order`);
        
        const orderDetailsArray = [];
    
        for (const order of userOrders) {
          try {
            // Get order details
            const { data: orderDetails } = await Api.getRequest(`/orders/orders/${order.id}`);
            
            // Fetch product details for each item in the order
            const itemsWithProducts = await Promise.all(
              orderDetails.items.map(async (item) => {
                try {
                  const { data: productDetails } = await Api.getRequest(`/products/products/${item.product_id}`);
                  return {
                    ...item,
                    productDetails
                  };
                } catch (error) {
                  console.error(`Error fetching product details for product ${item.product_id}:`, error);
                  return item; // Return original item if product fetch fails
                }
              })
            );
    
            // Create enhanced order object with product details
            const enhancedOrderDetails = {
              ...orderDetails,
              items: itemsWithProducts
            };
    
            orderDetailsArray.push(enhancedOrderDetails);
          } catch (error) {
            console.error(`Error fetching details for order ${order.id}:`, error);
          }
        }
    
        // Dispatch the collected order details to store
        dispatch({
          type: 'GET_ORDERS_SUCCESS',
          payload: orderDetailsArray
        });
    
        console.log('order details array', orderDetailsArray);
        return orderDetailsArray;
    
      } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
      }
    };
