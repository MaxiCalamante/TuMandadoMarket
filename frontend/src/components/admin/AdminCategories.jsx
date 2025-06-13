import React, { useState, useEffect } from 'react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Simulamos datos por ahora
      const mockCategories = [
        { id: 1, name: 'Comidas', description: 'Platos principales y comidas', products_count: 25 },
        { id: 2, name: 'Bebidas', description: 'Bebidas frías y calientes', products_count: 15 },
        { id: 3, name: 'Promociones', description: 'Ofertas especiales', products_count: 8 },
        { id: 4, name: 'Artículos Varios', description: 'Otros productos', products_count: 12 }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-section-header">
        <h2>Gestión de Categorías</h2>
        <button className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
          Agregar Categoría
        </button>
      </div>

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.products_count}</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Editar</button>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
