import {Api} from '../../utils/Api'
import * as actionTypes from '../constants/userContants'
import { setLoggedUserDetails, getUserDetails } from '../../utils/localstorage'

export const setUserDetails = () => async dispatch => {
  //http://127.0.0.1:5001/users/me
  const {statusCode, data} = await Api.getRequest(`/users/me`)

  if (statusCode === 400 || statusCode === 500) {
    dispatch({
      type: actionTypes.SET_INITIAL_STATE,
    })
    return
  }

  const {user} = JSON.parse(data)

  setLoggedUserDetails(data)

  const details = getUserDetails()

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
