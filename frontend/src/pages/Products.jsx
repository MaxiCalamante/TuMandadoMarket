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
      <div className="section">
        <div className="loading">
          Cargando productos...
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="section">
        <div className="section-header">
          <h1>Productos</h1>
          <p>Descubre nuestra amplia selección de productos</p>
        </div>

        {/* Filtros */}
        <div className="products-filters">
          <div className="filters-row">
            {/* Búsqueda */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
            </div>

            {/* Categoría */}
            <select
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

            {/* Ordenamiento */}
            <select
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

            {/* Limpiar filtros */}
            <button onClick={clearFilters} className="btn btn-ghost btn-sm">
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="products-results">
          <p className="results-count">
            {pagination.total > 0 
              ? `Mostrando ${products.length} de ${pagination.total} productos`
              : 'No se encontraron productos'
            }
          </p>
        </div>

        {/* Grid de productos */}
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7ZM19 18H5V9H19V18ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5S10.5 12.8 10.5 12 11.2 10.5 12 10.5 13.5 11.2 13.5 12Z" fill="currentColor"/>
              </svg>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Ver todos los productos
              </button>
            </div>
          </div>
        )}

        {/* Paginación */}
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
      </div>
    </div>
  );
};

export default Products;
