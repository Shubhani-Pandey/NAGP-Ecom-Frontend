export const access_token = 'E_COMMERCE_TOKEN'
export const user_details = 'E_COMMERCE_ADMIN'

export const setToken = token => {
  window.localStorage.setItem(access_token, token)
}

export const getToken = () => {
  let token = window.localStorage.getItem(access_token)
  if (!!token) return token
  return false
}

export const isLogin = () => {
  if (!!getToken()) {
    return true
  }
  return false
}

export const logout = () => {
  window.localStorage.clear()
}

export const setLoggedUserDetails = details => {
  window.localStorage.setItem(user_details, details)
}

export const getUserDetails = () => {
  let details = window.localStorage.getItem(user_details)
  if (!!details) return details
  return false
}

