import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: `/productos/${id}` } } });
      return;
    }

    setIsAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    
    if (result.success) {
      // Mostrar mensaje de éxito
      setQuantity(1);
    } else {
      alert(result.error);
    }
    
    setIsAddingToCart(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="loading">
          Cargando producto...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section">
        <div className="text-center">
          <h2>Producto no encontrado</h2>
          <Link to="/productos" className="btn btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  const isProductInCart = isInCart(product.id);
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <div className="product-detail-page">
      <div className="section">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/inicio" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/productos" className="breadcrumb-link">Productos</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail">
          {/* Imagen del producto */}
          <div className="product-detail-image">
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
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8ZM12 14C13.1 14 14 13.1 14 12S13.1 10 12 10 10 10.9 10 12 10.9 14 12 14Z" fill="currentColor"/>
                </svg>
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-detail-info">
            <div className="product-detail-header">
              <h1 className="product-detail-title">{product.name}</h1>
              
              {product.categories && (
                <span className="product-detail-category">
                  {product.categories.name}
                </span>
              )}
            </div>

            <div className="product-detail-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-detail-description">
              <h3>Descripción</h3>
              <p>{product.description || 'Sin descripción disponible'}</p>
            </div>

            <div className="product-detail-stock">
              <span className={`stock-indicator ${product.stock === 0 ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                {product.stock === 0 
                  ? 'Sin stock' 
                  : product.stock <= 5 
                    ? `Últimas ${product.stock} unidades`
                    : `${product.stock} unidades disponibles`
                }
              </span>
            </div>

            {/* Acciones */}
            <div className="product-detail-actions">
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Cantidad:</label>
                    <select
                      id="quantity"
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
                    disabled={isAddingToCart || !isAuthenticated()}
                    className="btn btn-primary btn-large"
                  >
                    {isAddingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>

                  {isProductInCart && (
                    <div className="in-cart-info">
                      En carrito: {cartQuantity} unidades
                    </div>
                  )}
                </>
              ) : (
                <button disabled className="btn btn-disabled btn-large">
                  Sin Stock
                </button>
              )}
            </div>

            {!isAuthenticated() && (
              <div className="auth-notice">
                <p>
                  <Link to="/login" className="auth-link">Inicia sesión</Link> o{' '}
                  <Link to="/register" className="auth-link">regístrate</Link> para agregar productos al carrito
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón volver */}
        <div className="product-detail-footer">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-ghost"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
