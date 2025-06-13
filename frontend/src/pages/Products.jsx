import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    sortOrder: searchParams.get('sortOrder') || 'asc'
  });
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    updateURL();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        category: filters.category,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.sortBy !== 'name') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'asc') params.set('sortOrder', filters.sortOrder);
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-page"> {/* Main wrapper */}
        <div className="section"> {/* Header section */}
          <div className="section-header">
            <h1>Productos</h1>
            <p>Descubre nuestra amplia selección de productos</p>
          </div>
        </div>
        {/* Skeleton for body */}
        {/* TODO: Add/enhance actual CSS for skeleton animations and appearance */}
        <div className="products-body-container section"> {/* Added section class for consistent spacing */}
          <aside className="filters-sidebar skeleton-sidebar">
            <h3>Filtrar Productos</h3>
            <div className="filter-group">
              <div className="skeleton skeleton-label" style={{ height: '16px', marginBottom: '8px', width: '50%' }}></div>
              <div className="skeleton skeleton-input" style={{ height: '38px' }}></div>
            </div>
            <div className="filter-group">
              <div className="skeleton skeleton-label" style={{ height: '16px', marginBottom: '8px', width: '70%' }}></div>
              <div className="skeleton skeleton-select" style={{ height: '38px' }}></div>
            </div>
            <div className="filter-group">
              <div className="skeleton skeleton-label" style={{ height: '16px', marginBottom: '8px', width: '60%' }}></div>
              <div className="skeleton skeleton-select" style={{ height: '38px' }}></div>
            </div>
            <div className="skeleton skeleton-button" style={{ height: '38px', marginTop: '16px' }}></div>
          </aside>
          <main className="products-main-content skeleton-main">
            <div className="products-results">
              <p className="results-count skeleton skeleton-text" style={{ height: '20px', width: '40%' }}></p>
            </div>
            <div className="products-grid">
              {Array.from({ length: pagination.limit || 12 }).map((_, index) => (
                <div key={index} className="product-card-skeleton">
                  <div className="skeleton skeleton-image" style={{ height: '150px', marginBottom: '10px' }}></div>
                  <div className="skeleton skeleton-text skeleton-title" style={{ height: '20px', marginBottom: '5px', width: '80%' }}></div>
                  <div className="skeleton skeleton-text skeleton-price" style={{ height: '18px', marginBottom: '10px', width: '50%' }}></div>
                  <div className="skeleton skeleton-button" style={{ height: '36px', width: '100px' }}></div>
                </div>
              ))}
            </div>
            <div className="pagination skeleton-pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <div className="skeleton skeleton-button-small" style={{ height: '32px', width: '80px', margin: '0 5px' }}></div>
              <div className="skeleton skeleton-text-small" style={{ height: '32px', width: '100px', margin: '0 5px', lineHeight: '32px', textAlign: 'center' }}></div>
              <div className="skeleton skeleton-button-small" style={{ height: '32px', width: '80px', margin: '0 5px' }}></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="section">
        <div className="section-header">
          <h1>Productos</h1>
          <p>Descubre nuestra amplia selección de productos</p>
        </div>

        {/* New layout for filters and product listing START */}
        {/* TODO: Implement responsive sidebar toggle & actual CSS styling for sidebar/main content layout */}
        <div className="products-body-container">
          <aside className="filters-sidebar">
            <h3>Filtrar Productos</h3>

            <div className="filter-group">
              <label htmlFor="search-input">Buscar:</label>
              <input
                id="search-input"
                type="text"
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="category-select">Categoría:</label>
              <select
                id="category-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                }}
                className="filter-select"
              >
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
                <option value="price-asc">Precio menor a mayor</option>
                <option value="price-desc">Precio mayor a menor</option>
                <option value="created_at-desc">Más recientes</option>
              </select>
            </div>

            <button onClick={clearFilters} className="btn btn-ghost btn-sm btn-block">
              Limpiar filtros
            </button>
          </aside>

          <main className="products-main-content">
            <div className="products-results">
              <p className="results-count">
                {pagination.total > 0
                  ? `Mostrando ${products.length} de ${pagination.total} productos`
                  : 'No se encontraron productos'
                }
              </p>
            </div>

            {products.length > 0 ? (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAdminActions={false}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"></path>
                    <path d="M22 22L18 18"></path>
                    <path d="M11.5 7V12"></path>
                    <path d="M11.5 15H11.51"></path>
                  </svg>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta ajustar los filtros de búsqueda</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Ver todos los productos
                  </button>
                </div>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-ghost btn-sm"
                >
                  Anterior
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.page) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="pagination-ellipsis">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`btn btn-sm ${
                            page === pagination.page ? 'btn-primary' : 'btn-ghost'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))
                  }
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-ghost btn-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </main>
        </div>
        {/* New layout for filters and product listing END */}
      </div>
    </div>
  );
};

export default Products;
