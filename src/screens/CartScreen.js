import "./CartScreen.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import {getUserDetails} from '../utils/localstorage'

// Components
import CartItem from "../components/CartItem";
import {Api} from '../utils/Api'

// Actions
import { addToCart, fetchCart, removeFromCart, resetCart } from "../redux/actions/cartActions";
import useLogin from "../utils/hooks/useLogin";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const user = useSelector(state => state.user)

  const { loginInfo } = useLogin();

  const { cartItems } = cart;

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch, loginInfo.isLogin]);

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, qty,'cartscreen'));
  };

  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart({  _id: item.product }));
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + Number(qty), 0);
  };

  const getCartSubTotal = () => {
    return cartItems
      .reduce((price, item) => price + item.price * item.qty, 0)
      .toFixed(2);
  };

  const handleProceedBtn = async () => {
      setIsLoading(true);
      try {
        
        const user_data = JSON.parse(getUserDetails())
        console.log(user_data['address'], user_data["name"], user_data["email"])
        
        //http://localhost:5004/orders
        // const {statusCode, data} = await Api.postRequest('/orders/orders/place')
        // console.log('order api response', statusCode, data)

        const statusCode=200

        if (statusCode == 200){

            // Clear cart after successful order
            console.log('cart reset, navigating to checkout')
            dispatch(resetCart());
            history.push('/checkout')
        }

        } catch (error) {
            console.error('Failed to place order: ' + error.message);
        } finally {
            setIsLoading(false);
        }
      
  }

  if (loginInfo.loading) return <h1>Loading.....</h1>;
  else if (!loginInfo.loading && loginInfo.isLogin)
    return (
      <>
        <div className="cartscreen">
          <div className="cartscreen__left">
            <h2>Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <div>
                Your Cart Is Empty <Link to="/">Go Back</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  qtyChangeHandler={qtyChangeHandler}
                  removeHandler={() => removeFromCartHandler(item)}
                />
              ))
            )}
          </div>

          <div className="cartscreen__right">
            <div className="cartscreen__info">
              <p>Subtotal ({getCartCount()}) items</p>
              <p>${getCartSubTotal()}</p>
            </div>
            <div>
            <button
                title="Order place functionality."
                onClick={handleProceedBtn}
                disabled={isLoading || cartItems.length === 0}
                className={`checkout-button ${isLoading ? 'loading' : ''}`}
            >
                {isLoading ? 'Processing...' : 'Proceed To Checkout'}
            </button>
            </div>
          </div>
        </div>
      </>
    );
};

export default CartScreen;
