import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Por ahora simulamos datos
      // En el futuro esto vendrá de la API
      const mockStats = {
        totalUsers: 156,
        totalProducts: 89,
        totalOrders: 234,
        totalRevenue: 125000,
        pendingOrders: 12,
        lowStockProducts: 5
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading">
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Resumen general del marketplace</p>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7S9.8 3 12 3S16 4.8 16 7ZM12 14C16.42 14 20 15.79 20 18V21H4V18C4 15.79 7.58 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7ZM19 18H5V9H19V18ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5S10.5 12.8 10.5 12 11.2 10.5 12 10.5 13.5 11.2 13.5 12Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Productos Activos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM13 16H7V14H13V16ZM17 8H7V6H17V8Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Órdenes Totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatPrice(stats.totalRevenue)}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
      </div>

      {/* Alertas y notificaciones */}
      <div className="dashboard-alerts">
        <h3>Alertas y Notificaciones</h3>
        <div className="alerts-grid">
          {stats.pendingOrders > 0 && (
            <div className="alert-card warning">
              <div className="alert-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>Órdenes Pendientes</h4>
                <p>Tienes {stats.pendingOrders} órdenes pendientes de procesar</p>
              </div>
            </div>
          )}

          {stats.lowStockProducts > 0 && (
            <div className="alert-card danger">
              <div className="alert-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>Stock Bajo</h4>
                <p>{stats.lowStockProducts} productos con stock bajo</p>
              </div>
            </div>
          )}

          <div className="alert-card success">
            <div className="alert-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21S3 16.97 3 12 7.03 3 12 3 21 7.03 21 12Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="alert-content">
              <h4>Sistema Operativo</h4>
              <p>Todos los sistemas funcionan correctamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
            </svg>
            Agregar Producto
          </button>
          
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
            </svg>
            Nueva Categoría
          </button>
          
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
            </svg>
            Ver Reportes
          </button>
          
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7S10 7.9 10 9H8C8 6.79 9.79 5 12 5S16 6.79 16 9C16 9.88 15.64 10.67 15.07 11.25Z" fill="currentColor"/>
            </svg>
            Soporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
