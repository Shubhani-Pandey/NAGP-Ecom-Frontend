
import { useHistory } from 'react-router-dom';
import {useEffect} from 'react'
import './CheckoutScreen.css';

const CheckoutScreen = () => {

    console.log('checkout screen rendered')
    const history = useHistory();

    useEffect(() => {
        console.log('CheckoutScreen mounted');
    }, []);

    const handleContinueShopping = () => {
        history.push('/');
    };

    return (
        <div className="checkout-success">
            <div className="success-card">
                <div className="success-icon">
                    <svg 
                        viewBox="0 0 24 24" 
                        className="checkmark"
                    >
                        <path 
                            fill="none" 
                            d="M4.1 12.7L9 17.6 20.3 6.3" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase</p>
                <div className="order-details">
                    <p>Order confirmation has been sent to your email</p>
                </div>
                <button 
                    className="continue-shopping-btn"
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CheckoutScreen
