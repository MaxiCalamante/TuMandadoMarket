import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      await clearCart();
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Aquí implementaremos la lógica de checkout
      // Por ahora, redirigimos a una página de confirmación
      navigate('/mis-pedidos');
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.21; // IVA 21%
  const shipping = subtotal > 5000 ? 0 : 500; // Envío gratis por compras mayores a $5000
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="section">
          <div className="section-header">
            <h1>Carrito de Compras</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-content">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
              </svg>
              <h2>Tu carrito está vacío</h2>
              <p>Agrega algunos productos para comenzar tu compra</p>
              <Link to="/productos" className="btn btn-primary btn-large">
                Explorar Productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="section">
        <div className="section-header">
          <h1>Carrito de Compras</h1>
          <p>Revisa tus productos antes de finalizar la compra</p>
        </div>

        <div className="cart-content">
          {/* Items del carrito */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Productos ({cartItems.length})</h2>
              <button 
                onClick={handleClearCart}
                className="btn btn-ghost btn-sm"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.products.image_url ? (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="placeholder-image">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8ZM12 14C13.1 14 14 13.1 14 12S13.1 10 12 10 10 10.9 10 12 10.9 14 12 14Z" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3 className="cart-item-name">
                      <Link to={`/productos/${item.products.id}`}>
                        {item.products.name}
                      </Link>
                    </h3>
                    <p className="cart-item-price">
                      {formatPrice(item.products.price)}
                    </p>
                    {item.products.categories && (
                      <span className="cart-item-category">
                        {item.products.categories.name}
                      </span>
                    )}
                  </div>

                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Cantidad:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= item.products.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <span className="item-total-price">
                      {formatPrice(item.products.price * item.quantity)}
                    </span>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="btn btn-ghost btn-sm remove-btn"
                      title="Eliminar producto"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="cart-summary">
            <div className="cart-summary-content">
              <h2>Resumen del Pedido</h2>
              
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="summary-line">
                <span>IVA (21%):</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              
              {shipping === 0 && (
                <div className="shipping-notice">
                  ¡Envío gratis por compras mayores a $5,000!
                </div>
              )}
              
              <div className="summary-line total-line">
                <span>Total:</span>
                <span className="total-amount">{formatPrice(total)}</span>
              </div>

              <div className="checkout-actions">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="btn btn-primary btn-large checkout-btn"
                >
                  {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
                </button>
                
                <Link to="/productos" className="btn btn-outline btn-large">
                  Seguir Comprando
                </Link>
              </div>

              <div className="security-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
                </svg>
                Compra 100% segura y protegida
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
