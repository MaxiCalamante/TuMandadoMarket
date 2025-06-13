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
  const [cartMessage, setCartMessage] = useState(null);

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
      setCartMessage({ type: 'success', text: '¡Producto agregado al carrito!' });
      setQuantity(1);
    } else {
      setCartMessage({ type: 'error', text: result.error || 'Error al agregar el producto.' });
    }
    // TODO: Clear cartMessage after a few seconds
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
      <div className="product-detail-page">
        <div className="section">
          {/* Skeleton for Breadcrumb */}
          <nav className="breadcrumb skeleton-breadcrumb" style={{ marginBottom: '20px' }}>
            <span className="skeleton skeleton-text" style={{ width: '50px', height: '16px', marginRight: '5px' }}></span>
            <span className="skeleton skeleton-text" style={{ width: '10px', height: '16px', marginRight: '5px' }}></span>
            <span className="skeleton skeleton-text" style={{ width: '70px', height: '16px', marginRight: '5px' }}></span>
            <span className="skeleton skeleton-text" style={{ width: '10px', height: '16px', marginRight: '5px' }}></span>
            <span className="skeleton skeleton-text" style={{ width: '100px', height: '16px' }}></span>
          </nav>

          <div className="product-detail">
            <div className="product-detail-image skeleton">
              <div className="skeleton skeleton-image-main" style={{ width: '100%', height: '300px', backgroundColor: '#eee' }}></div>
              {/* Placeholder for thumbnail gallery if we add it later */}
            </div>
            <div className="product-detail-info skeleton-info">
              <div className="skeleton skeleton-title" style={{ width: '70%', height: '36px', marginBottom: '10px' }}></div>
              <div className="skeleton skeleton-category" style={{ width: '30%', height: '18px', marginBottom: '20px' }}></div>
              <div className="skeleton skeleton-price" style={{ width: '40%', height: '30px', marginBottom: '20px' }}></div>
              <div className="skeleton-description">
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%', height: '16px', marginBottom: '20px' }}></div>
              </div>
              <div className="skeleton skeleton-stock" style={{ width: '50%', height: '20px', marginBottom: '20px' }}></div>
              <div className="product-detail-actions skeleton-actions" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="skeleton skeleton-input" style={{ width: '80px', height: '40px', marginRight: '10px' }}></div>
                <div className="skeleton skeleton-button" style={{ flexGrow: 1, height: '40px' }}></div>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: Add/enhance actual CSS for skeleton animations and appearance */}
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
                  e.target.src = '/placeholder-image.jpg'; // Assuming this path is correct
                }}
              />
            ) : (
              <div className="placeholder-image">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8ZM12 14C13.1 14 14 13.1 14 12S13.1 10 12 10 10 10.9 10 12 10.9 14 12 14Z" fill="currentColor"/>
                </svg>
              </div>
            )}
            <div className="product-thumbnails-placeholder">{/* TODO: Implement image thumbnail gallery here if product has multiple images */}</div>
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
                    <label htmlFor="quantity-input">Cantidad:</label>
                    <div className="quantity-input-group">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                        className="btn btn-ghost btn-sm"
                      >-</button>
                      <input
                        type="number"
                        id="quantity-input"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val)) {
                            setQuantity(1);
                          } else {
                            setQuantity(Math.max(1, Math.min(val, product.stock, 10)));
                          }
                        }}
                        onBlur={(e) => { // Ensure value is at least 1 if user leaves it empty
                          if (e.target.value === '' || parseInt(e.target.value) < 1) {
                            setQuantity(1);
                          }
                        }}
                        min="1"
                        max={Math.min(product.stock, 10)} // Set max attribute for native browser validation
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock, 10))}
                        disabled={quantity >= Math.min(product.stock, 10)}
                        className="btn btn-ghost btn-sm"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !isAuthenticated() || quantity > product.stock}
                    className="btn btn-primary btn-large"
                  >
                    {isAddingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>

                  {cartMessage && <div className={`cart-message ${cartMessage.type}`}>{cartMessage.text}</div>}

                  {isProductInCart && (
                    <div className="in-cart-info">
                      En carrito: {cartQuantity} unidades (agregando {quantity} más)
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

      <section className="related-products-section section">
        <div className="section-header">
          <h2>Productos Relacionados</h2>
        </div>
        <div className="products-grid">
          {/* TODO: Fetch and display related products here. For now, placeholder cards: */}
          <div className="placeholder-product-card">Producto Relacionado 1</div>
          <div className="placeholder-product-card">Producto Relacionado 2</div>
          <div className="placeholder-product-card">Producto Relacionado 3</div>
        </div>
      </section>

      <section className="customer-reviews-section section">
        <div className="section-header">
          <h2>Opiniones de Clientes</h2>
        </div>
        <div className="reviews-list">
          {/* TODO: Fetch and display customer reviews here. For now, placeholder review: */}
          <div className="placeholder-review">
            <p><strong>Cliente Satisfecho:</strong> "¡Excelente producto!"</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
