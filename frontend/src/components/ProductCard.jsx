import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, showAdminActions = false, onEdit, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    setIsLoading(true);
    const result = await addToCart(product.id, quantity);
    
    if (result.success) {
      alert('Producto agregado al carrito');
      setQuantity(1);
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const isProductInCart = isInCart(product.id);
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <div className="product-image">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="placeholder-image">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8ZM12 14C13.1 14 14 13.1 14 12S13.1 10 12 10 10 10.9 10 12 10.9 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
        )}
        
        {/* Badge de stock */}
        {product.stock === 0 && (
          <div className="stock-badge out-of-stock">
            Sin Stock
          </div>
        )}
        
        {product.stock > 0 && product.stock <= 5 && (
          <div className="stock-badge low-stock">
            Últimas {product.stock} unidades
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/productos/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.name}
          </Link>
        </h3>

        <p className="product-description">
          {product.description?.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description
          }
        </p>

        {/* Categoría */}
        {product.categories && (
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--background-secondary)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--border-radius-sm)',
            display: 'inline-block',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {product.categories.name}
          </span>
        )}

        {/* Precio */}
        <div className="product-price">
          {formatPrice(product.price)}
        </div>

        {/* Stock disponible */}
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: 'var(--spacing-md)'
        }}>
          Stock: {product.stock} unidades
        </div>

        {/* Acciones del producto */}
        <div className="product-actions">
          {showAdminActions ? (
            // Acciones de administrador
            <div className="admin-actions">
              <button
                onClick={() => onEdit(product)}
                className="btn btn-secondary btn-sm"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(product)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </div>
          ) : (
            // Acciones de cliente
            <div className="customer-actions">
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector">
                    <label htmlFor={`quantity-${product.id}`}>Cantidad:</label>
                    <select
                      id={`quantity-${product.id}`}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      max={product.stock}
                    >
                      {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading || !isAuthenticated()}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>

                  {isProductInCart && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--success-color)',
                      marginTop: 'var(--spacing-sm)',
                      textAlign: 'center'
                    }}>
                      En carrito ({cartQuantity} unidades)
                    </div>
                  )}
                </>
              ) : (
                <button disabled className="btn btn-disabled">
                  Sin Stock
                </button>
              )}

              <Link
                to={`/productos/${product.id}`}
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Ver Detalles
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
