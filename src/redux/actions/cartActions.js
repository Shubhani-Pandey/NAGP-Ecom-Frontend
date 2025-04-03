import { ADD_TO_CART, REMOVE_FROM_CART, FETCH_MY_CART }  from '../constants/cartConstants'
import axios from 'axios'
import {Api} from '../../utils/Api'
import {convertToCartData} from '../../utils/utils.function'

export const addToCart = (id, qty, screen=null) => async (dispatch, getState) => {
  const {data} = await Api.getRequest(`http://127.0.0.1:5002/products/${id}`)
  const product = JSON.parse(data)
  
  if (screen==null) {
      // Get current cart state
      const { cart } = getState();
      
      // Check if product already exists in cart
      const existingItem = cart.cartItems.find(item => item.product === product.product_id);
      
      // Calculate new quantity
      qty = existingItem ? Number(existingItem.qty) + Number(qty) : Number(qty);
      console.log('new wuantity', qty)
  }

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: product.product_id,
      name: product.name,
      imageUrl: product.product_image_url,
      price: product.price,
      countInStock: product.stock,
      qty,
    },
  })

  Api.postRequest('http://127.0.0.1:5003/cart', {product_id: id, quantity: qty})
}

export const removeFromCart =
  ({_id}) =>
  dispatch => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: _id,
    })
    Api.DeleteRequest('http://127.0.0.1:5003/cart/' + _id)
  }

export const fetchCart = () => async dispatch => {
  try {
    const {data: strigifyData} = await Api.getRequest(`http://127.0.0.1:5003/user_cart`)
    const {items} = JSON.parse(strigifyData)

    console.log('carts:', items)

    dispatch({
      type: FETCH_MY_CART,
      payload: {
        carts: convertToCartData(items),
      },
    })
  } catch (e) {
    console.log('EROROR :  ', e)
  }
}

export const resetCart = () => {
  return {
      type: 'CART_RESET',
      payload: {
          cartItems: []
      }
  }
}