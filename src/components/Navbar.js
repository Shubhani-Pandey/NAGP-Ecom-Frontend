import './Navbar.css'
import React, {useCallback, useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {logout, getUserDetails} from '../utils/localstorage'
import {setInitialState} from '../redux/actions/userAction'
import { resetCart } from '../redux/actions/cartActions'


const Navbar = ({click}) => {
  const cart = useSelector(state => state.cart)
  const history = useHistory()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);

  const {cartItems} = cart

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0)
  }

  const _handleLogout = () => {
    dispatch(setInitialState())
    dispatch(resetCart())
    logout()
    history.push('/')
  }
  
  const _showOrderHistory = () => {
    history.push('/orderhistory')
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <h2>NAGARRO NAGP E-COMMERCE WEBSITE- de535e16-82f9-496b-84c3-8a79ef534dd8</h2>
      </div>

      <ul className="navbar__links">
        <li>
          <Link to="/cart" className="cart__link">
            <i className="fas fa-shopping-cart"></i>
            <span>
              Cart <span className="cartlogo__badge">{getCartCount()}</span>
            </span>
          </Link>
        </li>

        <li>
          <Link to="/">Shop</Link>
        </li>

        {!getUserDetails() ? (
          <li>
            <Link to="/signin">Login</Link>
          </li>
        ) : (
          <li className="dropdown">
            <p  className="user-name" onClick={() => setShowDropdown(!showDropdown)}>
              {getUserDetails()?.email.split('@')[0] || 'user'} ▼
            </p>
            
            <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
              <div 
                className="dropdown-item"
                onClick={() => {
                  // history.push('/profile'); // Add this route if you have a profile page
                  setShowDropdown(false);
                }}
              >
                Your Profile
              </div>
              <div 
                className="dropdown-item"
                onClick={() => {
                  _showOrderHistory();
                  setShowDropdown(false);
                }}
              >
                Order History
              </div>
              <div 
                className="dropdown-item"
                onClick={() => {
                  _handleLogout();
                  setShowDropdown(false);
                }}
              >
                Logout
              </div>
            </div>
            
            {/* Close dropdown when clicking outside */}
            {showDropdown && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0
                }}
                onClick={() => setShowDropdown(false)}
              />
            )}
          </li>
        )}
      </ul>

      <div className="hamburger__menu" onClick={click}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
