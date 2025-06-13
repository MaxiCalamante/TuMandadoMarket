import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Por ahora simulamos datos de órdenes
      // En el futuro esto vendrá de la API
      const mockOrders = [
        {
          id: 1,
          order_number: 'ORD-2024-001',
          status: 'pending',
          total: 2500,
          created_at: '2024-01-15T10:30:00Z',
          items: [
            {
              id: 1,
              product_name: 'Pizza Margherita',
              quantity: 2,
              price: 1200,
              total: 2400
            },
            {
              id: 2,
              product_name: 'Coca Cola 500ml',
              quantity: 1,
              price: 100,
              total: 100
            }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-2024-002',
          status: 'completed',
          total: 1800,
          created_at: '2024-01-10T14:20:00Z',
          items: [
            {
              id: 3,
              product_name: 'Hamburguesa Completa',
              quantity: 1,
              price: 1500,
              total: 1500
            },
            {
              id: 4,
              product_name: 'Papas Fritas',
              quantity: 1,
              price: 300,
              total: 300
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'En Progreso',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      try {
        // Aquí implementaremos la cancelación de órdenes
        console.log('Cancelando orden:', orderId);
        // Actualizar el estado local por ahora
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error al cancelar el pedido. Intenta nuevamente.');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="loading">
          Cargando pedidos...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="section">
        <div className="section-header">
          <h1>Mis Pedidos</h1>
          <p>Historial completo de tus compras y estado de pedidos</p>
        </div>

        {/* Filtros */}
        <div className="orders-filters">
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            >
              En Progreso ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Completados ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            >
              Cancelados ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Lista de órdenes */}
        {filteredOrders.length > 0 ? (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">#{order.order_number}</h3>
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>
                  
                  <div className="order-status">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatPrice(order.total)}</span>
                  </div>
                  
                  <div className="order-actions">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="btn btn-ghost btn-sm"
                    >
                      {expandedOrder === order.id ? 'Ocultar' : 'Ver'} Detalles
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalles expandibles */}
                {expandedOrder === order.id && (
                  <div className="order-details">
                    <h4>Productos del Pedido</h4>
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.product_name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <div className="item-prices">
                            <span className="item-unit-price">{formatPrice(item.price)} c/u</span>
                            <span className="item-total-price">{formatPrice(item.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-summary">
                      <div className="summary-line">
                        <span>Subtotal:</span>
                        <span>{formatPrice(order.total * 0.826)}</span>
                      </div>
                      <div className="summary-line">
                        <span>IVA (21%):</span>
                        <span>{formatPrice(order.total * 0.174)}</span>
                      </div>
                      <div className="summary-line total-line">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <div className="no-orders-content">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7ZM19 18H5V9H19V18ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5S10.5 12.8 10.5 12 11.2 10.5 12 10.5 13.5 11.2 13.5 12Z" fill="currentColor"/>
              </svg>
              <h2>
                {filter === 'all' 
                  ? 'No tienes pedidos aún'
                  : `No tienes pedidos ${getStatusText(filter).toLowerCase()}`
                }
              </h2>
              <p>
                {filter === 'all'
                  ? 'Cuando realices tu primera compra, aparecerá aquí'
                  : 'Cambia el filtro para ver otros pedidos'
                }
              </p>
              <Link to="/productos" className="btn btn-primary btn-large">
                Explorar Productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
