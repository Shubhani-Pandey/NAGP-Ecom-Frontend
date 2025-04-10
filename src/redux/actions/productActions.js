import * as actionTypes from '../constants/productConstants'
import axios from 'axios'
import {Api} from '../../utils/Api'


const cache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes in milliseconds
}

export const getProducts = () => async dispatch => {
  try {
    dispatch({type: actionTypes.GET_PRODUCTS_REQUEST})

    // Check if we have valid cached data
    if (cache.data && cache.timestamp) {
      // console.log('using cached data')
      const now = Date.now()
      if (now - cache.timestamp < cache.CACHE_DURATION) {
        // Return cached data if it's still valid
        // console.log(cache.data)
        return dispatch({
          type: actionTypes.GET_PRODUCTS_SUCCESS,
          payload: cache.data,
        })
      }
    }

    // If no cache or cache expired, make the API call
    //http://127.0.0.1:5002/products
    const {data} = await Api.getRequest('/products/products/get')
    const parsedData = data

    // Update the cache
    cache.data = parsedData
    cache.timestamp = Date.now()

    dispatch({
      type: actionTypes.GET_PRODUCTS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: actionTypes.GET_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getProductDetails = id => async dispatch => {
  try {
    dispatch({type: actionTypes.GET_PRODUCT_DETAILS_REQUEST})
    
    //http://127.0.0.1:5002/products/${id}
    const {data} = await Api.getRequest(`/products/products/${id}`)
    const p = data

    dispatch({
      type: actionTypes.GET_PRODUCT_DETAILS_SUCCESS,
      payload: {
        ...p,
      },
    })
  } catch (error) {
    dispatch({
      type: actionTypes.GET_PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const removeProductDetails = () => dispatch => {
  dispatch({type: actionTypes.GET_PRODUCT_DETAILS_RESET})
}
