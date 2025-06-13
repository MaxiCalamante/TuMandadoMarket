import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../utils/api';
import ProductCard from '../ProductCard';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      try {
        await productsAPI.delete(product.id);
        await fetchProducts(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Recargar la lista
  };

  if (loading) {
    return (
      <div className="loading">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-section-header">
        <h2>Gestión de Productos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos */}
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              showAdminActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div className="no-products-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7ZM19 18H5V9H19V18ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5S10.5 12.8 10.5 12 11.2 10.5 12 10.5 13.5 11.2 13.5 12Z" fill="currentColor"/>
            </svg>
            <h3>No hay productos</h3>
            <p>Comienza agregando tu primer producto</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Agregar Producto
            </button>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h3>
              <button 
                onClick={handleFormClose}
                className="modal-close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Formulario de producto (por implementar)</p>
              <button 
                onClick={handleFormClose}
                className="btn btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
