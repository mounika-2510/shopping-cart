import React, { useState, useEffect } from "react";
import "./App.css";

// Product Data
const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  // Calculate Subtotal
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [cart]);

  // Manage Free Gift Logic
  useEffect(() => {
    const giftInCart = cart.some((item) => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !giftInCart) {
      setCart((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
    } else if (subtotal < THRESHOLD && giftInCart) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal, cart]);

  // Add Product to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update Quantity
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  return (
    <div className="container">
      <h2>Shopping Cart</h2>

      {/* Products Section */}
      <div className="products">
        {PRODUCTS.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>

        {/* Progress Bar */}
        {subtotal < THRESHOLD ? (
          <div className="progress-container">
            <p>Add ₹{THRESHOLD - subtotal} more to get a FREE Wireless Mouse!</p>
            <progress value={subtotal} max={THRESHOLD}></progress>
          </div>
        ) : (
          <p className="gift-message">You got a free Wireless Mouse!</p>
        )}
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        <h3>Cart Items</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <p>
                {item.name} - ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
              {item.id !== FREE_GIFT.id && (
                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              )}
              {item.id === FREE_GIFT.id && <span className="gift-tag">FREE GIFT</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
