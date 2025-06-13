import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { 
    cartItems, 
    total, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      alert(result.error);
    }
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      const result = await removeFromCart(itemId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      const result = await clearCart();
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">
          ⏳ Cargando carrito...
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>¡Agrega algunos productos para comenzar!</p>
          <Link to="/products" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Mi Carrito</h1>
        <button 
          onClick={handleClearCart}
          className="btn btn-outline btn-sm"
        >
          🗑️ Vaciar Carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.products?.image_url ? (
                  <img 
                    src={item.products.image_url} 
                    alt={item.products?.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">📦</div>
                )}
              </div>

              <div className="item-details">
                <h3 className="item-name">
                  <Link to={`/products/${item.products?.id}`}>
                    {item.products?.name}
                  </Link>
                </h3>
                <p className="item-description">
                  {item.products?.description}
                </p>
                <div className="item-price">
                  {formatPrice(item.products?.price || 0)}
                </div>
              </div>

              <div className="item-quantity">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingItems[item.id]}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">
                    {updatingItems[item.id] ? '⏳' : item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={
                      item.quantity >= (item.products?.stock || 0) || 
                      updatingItems[item.id]
                    }
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="stock-info">
                  Stock disponible: {item.products?.stock || 0}
                </div>
              </div>

              <div className="item-total">
                <div className="total-price">
                  {formatPrice((item.products?.price || 0) * item.quantity)}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="remove-btn"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Resumen del Pedido</h3>
            
            <div className="summary-line">
              <span>Productos ({cartItems.length}):</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <div className="summary-line">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            
            <div className="summary-line total-line">
              <span><strong>Total:</strong></span>
              <span><strong>{formatPrice(total)}</strong></span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-large checkout-btn"
              disabled={cartItems.length === 0}
            >
              🚀 Proceder al Checkout
            </button>

            <Link to="/products" className="btn btn-outline btn-large">
              ← Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
