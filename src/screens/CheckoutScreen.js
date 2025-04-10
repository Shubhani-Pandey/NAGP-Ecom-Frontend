import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './CheckoutScreen.css';

const CheckoutScreen = () => {
    console.log('Component function started');
    const history = useHistory();

    useEffect(() => {
        console.log('CheckoutScreen mounted');
    }, []);


    console.log('checkout screen rendered')

    const handleContinueShopping = () => {
        history.push('/');
    };

    try {
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
    } catch (error) {
        console.error('Error in CheckoutScreen:', error);
        return (
            <div className="error-container">
                <h2>Something went wrong</h2>
                <p>Error in CheckoutScreen: {error.message}</p>
            </div>
        );
    }
};

export default CheckoutScreen
