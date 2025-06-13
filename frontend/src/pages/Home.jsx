import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener categorías
        const categoriesResponse = await productsAPI.getCategories();
        setCategories(categoriesResponse.data.categories || []);
        
        // Obtener productos destacados (primeros 8)
        const productsResponse = await productsAPI.getAll({ limit: 8 });
        setFeaturedProducts(productsResponse.data.products || []);
        
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a TuMandadoMarket</h1>
          <p>
            Tu marketplace de confianza para comidas, bebidas y mucho más.
            Encuentra todo lo que necesitas con la mejor calidad y precios.
          </p>
          <div className="hero-actions">
            <Link to="/productos" className="btn btn-primary btn-large">
              Ver Productos
            </Link>
            <Link to="/register" className="btn btn-outline btn-large">
              Registrarse
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-visual">TM</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section section">
        <div className="section-header">
          <h2>Categorías</h2>
          <p>Explora nuestras diferentes categorías de productos</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/productos?category=${category.id}`}
              className="category-card"
            >
              <div className="category-icon">
                {getCategoryIcon(category.name)}
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Los productos más populares de nuestra tienda</p>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAdminActions={false}
            />
          ))}
        </div>

        <div className="section-footer">
          <Link to="/productos" className="btn btn-primary">
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="section-header">
          <h2>¿Por qué elegir TuMandadoMarket?</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H5L7.68 14.39C7.77 14.8 8.17 15.1 8.58 15.1H19.4C19.8 15.1 20.2 14.8 20.3 14.39L22 5H7M20 19C20 20.1 19.1 21 18 21S16 20.1 16 19 16.9 17 18 17 20 17.9 20 19ZM9 19C9 20.1 8.1 21 7 21S5 20.1 5 19 5.9 17 7 17 9 17.9 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Entrega Rápida</h3>
            <p>Recibe tus productos en tiempo récord con nuestro servicio de entrega express.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4H4L7.68 15.39C7.77 15.8 8.17 16.1 8.58 16.1H19.4C19.8 16.1 20.2 15.8 20.3 15.39L22 6H6M16 10L18 12L22 8M9 19.5C9.83 19.5 10.5 20.17 10.5 21S9.83 22.5 9 22.5 7.5 21.83 7.5 21 8.17 19.5 9 19.5ZM20 19.5C20.83 19.5 21.5 20.17 21.5 21S20.83 22.5 20 22.5 18.5 21.83 18.5 21 19.17 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Pago Seguro</h3>
            <p>Transacciones 100% seguras con múltiples métodos de pago disponibles.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21S3 16.97 3 12 7.03 3 12 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Calidad Garantizada</h3>
            <p>Productos de la mejor calidad, cuidadosamente seleccionados para ti.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V18C22 19.1 21.1 20 20 20H16.92C16.4 20 15.9 19.8 15.5 19.4L13 16.9C12.6 16.5 12.6 15.9 13 15.5L15.5 13C15.9 12.6 16.4 12.4 16.92 12.4H20C21.1 12.4 22 13.3 22 14.4V16.92ZM2 7.08V6C2 4.9 2.9 4 4 4H7.08C7.6 4 8.1 4.2 8.5 4.6L11 7.1C11.4 7.5 11.4 8.1 11 8.5L8.5 11C8.1 11.4 7.6 11.6 7.08 11.6H4C2.9 11.6 2 10.7 2 9.6V7.08Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Soporte 24/7</h3>
            <p>Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Comienza a comprar hoy</h2>
          <p>
            Únete a miles de clientes satisfechos y descubre la mejor experiencia de compra online.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Crear Cuenta Gratis
            </Link>
            <Link to="/productos" className="btn btn-outline btn-large">
              Explorar Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function para iconos de categorías
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Comidas': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.91 12.25L15.83 8.33L17.5 10H19L21 9ZM1 15H3L5 13L4 12L1 15ZM6.5 18.5L12 13L7.5 8.5L2 14L6.5 18.5Z" fill="currentColor"/>
      </svg>
    ),
    'Bebidas': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3V7C5 8.1 5.9 9 7 9H10V20C10 21.1 10.9 22 12 22S14 21.1 14 20V9H17C18.1 9 19 8.1 19 7V3H5ZM7 7V5H17V7H7Z" fill="currentColor"/>
      </svg>
    ),
    'Promociones': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
      </svg>
    ),
    'Artículos Varios': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };
  return icons[categoryName] || (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7ZM19 18H5V9H19V18ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5S10.5 12.8 10.5 12 11.2 10.5 12 10.5 13.5 11.2 13.5 12Z" fill="currentColor"/>
    </svg>
  );
};

export default Home;
