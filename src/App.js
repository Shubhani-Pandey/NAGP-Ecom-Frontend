import './App.css'
import {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'



// Components
import Navbar from './components/Navbar'
import SideDrawer from './components/SideDrawer'
import Backdrop from './components/Backdrop'
import Search from './components/Search'
import { lazy, Suspense } from 'react';

// Screens
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
import {useDispatch} from 'react-redux'
import {fetchCart} from './redux/actions/cartActions'
import {setUserDetails} from './redux/actions/userAction'
import { GoogleOAuthProvider } from '@react-oauth/google';

// const ProductScreen = lazy(() => import('./screens/ProductScreen'));



function App() {


  const [sideToggle, setSideToggle] = useState(false)
  // fetchCart
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchCart())
    dispatch(setUserDetails())
  }, [dispatch])

    return (
      <Router>
        <Navbar click={() => setSideToggle(true)} />
        <SideDrawer show={sideToggle}  click={() => setSideToggle(false)} />
        <Backdrop show={sideToggle} click={() => setSideToggle(false)} />

        <main className="app">
        {/* <Suspense fallback={<LoadingSpinner />}> */}
          <Switch>
            <Route exact path="/" component={Search} /> 
            {/* <Route exact path="/" component={HomeScreen} /> */}
            <Route exact path="/product/:id" component={ProductScreen} />
            <Route exact path="/cart" component={CartScreen} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/orderhistory" component={OrderHistoryScreen} />
            <Route exact path="/checkout" component={CheckoutScreen} />
            <GoogleOAuthProvider clientId="873030555216-cqldesg27nih66kbcmg6bp3135rokd4q.apps.googleusercontent.com">
                <Route exact path="/signin" component={SignIn} />
            </GoogleOAuthProvider>
            {/* <Route exact path="/order/:id" component={OrderScreen} /> */}
          </Switch>
          {/* </Suspense> */}
        </main>
      </Router>
    )
}

export default App
