import './OrderHistoryScreen.css'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

// Actions
import {getOrderDetails} from '../redux/actions/orderActions'

const OrderHistoryScreen = ({match, history}) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await dispatch(getOrderDetails());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [dispatch])


  const orderDetailsArray = useSelector(state => state.getOrderDetails)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const handleProductClick = (productId) => {
    history.push(`/product/${productId}`);
  };

  if (!orderDetailsArray || !orderDetailsArray.orderDetailsArray) {
    return <div className="order-history-container">Loading...</div>;
  }

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      {Object.keys(orderDetailsArray.orderDetailsArray).length > 0 ? (
        Object.values(orderDetailsArray.orderDetailsArray).map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <div className="order-info">
                <p><span>Order ID:</span> #{order.id}</p>
                <p><span>Order Date:</span> {formatDate(order.created_at)}</p>
                <p><span>Status:</span> <span className={`status ${order.status}`}>{order.status}</span></p>
              </div>
              <div className="order-total">
                <p><span>Total Amount:</span> ${order.total_amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="shipping-info">
              <p><span>Shipping Address:</span> {order.shipping_address}</p>
            </div>

            <div className="order-products-grid">
              {order.items && order.items.map((item) => (
                <div 
                  className="order-product-tile" 
                  key={item.id}
                  onClick={() => handleProductClick(item.productDetails.product_id)}
                >
                  <div className="order-product-image">
                    <img 
                      src={item.productDetails.product_image_url} 
                      alt={item.productDetails.name}
                    />
                  </div>
                  <div className="order-product-info">
                    <h3>{item.productDetails.name}</h3>
                    <p className="brand">{item.productDetails.brand_name}</p>
                    <div className="price-quantity-info">
                      <p>${item.price.toFixed(2)} x {item.quantity}</p>
                      <p className="total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-orders">No orders found</div>
      )}
    </div>
  );
};

export default OrderHistoryScreen;