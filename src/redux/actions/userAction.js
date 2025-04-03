import {Api} from '../../utils/Api'
import * as actionTypes from '../constants/userContants'
import { setLoggedUserDetails, getUserDetails } from '../../utils/localstorage'

export const setUserDetails = () => async dispatch => {
  const {statusCode, data} = await Api.getRequest(`http://127.0.0.1:5001/users/me`)
  
  console.log(`http://127.0.0.1:5001/users/me`)
  console.log('user data', statusCode, data)

  if (statusCode === 400 || statusCode === 500) {
    dispatch({
      type: actionTypes.SET_INITIAL_STATE,
    })
    return
  }

  const {user} = JSON.parse(data)

  setLoggedUserDetails(data)

  const details = getUserDetails()
  console.log(details)

  dispatch({
    type: actionTypes.SET_USER,
    payload: {
      isLogin: true,
      details: {...user},
    },
  })
}

export const setInitialState = () => async dispatch => {
  dispatch({
    type: actionTypes.SET_INITIAL_STATE,
  })
}
