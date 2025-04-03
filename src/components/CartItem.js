import "./CartItem.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const CartItem = ({ item, qtyChangeHandler, removeHandler }) => {
  return (
    <div className="cartitem-container">

      <div className="cartitem__image">
        <img src={item.imageUrl} alt={item.name} />
      </div>

      <div className="cartitem__productdetails">

        <Link to={`/product/${item.product}`} className="cartItem__name">
          <h2>{item.name}</h2>
        </Link>

        <p className="cartitem__price">${item.price}</p>
        
        <div className="cartitem__quantity">
          <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={() => {
                  if (item.qty > 1) {
                    qtyChangeHandler(item.product, item.qty - 1)
                  }
                }}
                disabled={item.qty <= 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>

              <span className="quantity-display">{item.qty}</span>

              <button 
                className="quantity-btn"
                onClick={() => {
                  if (item.qty < item.countInStock) {
                    qtyChangeHandler(item.product, item.qty + 1)
                  }
                }}
                disabled={item.qty >= item.countInStock}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

          {/* <select
            value={item.qty}
            onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
            className="cartItem__select"
          >
            {[...Array(item.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select> */}
          
          <button
            className="cartItem__deleteBtn"
            onClick={() => removeHandler(item.product)}
            aria-label="Delete item"
          >
            <FontAwesomeIcon icon={faTrash} />
            {/* <i className="fas fa-trash"></i> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
