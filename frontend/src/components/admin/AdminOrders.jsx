import React, { useState, useEffect } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulamos datos por ahora
      const mockOrders = [
        {
          id: 1,
          order_number: 'ORD-2024-001',
          customer: 'Juan Pérez',
          status: 'pending',
          total: 2500,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          order_number: 'ORD-2024-002',
          customer: 'María García',
          status: 'completed',
          total: 1800,
          created_at: '2024-01-10T14:20:00Z'
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

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="loading">
        Cargando órdenes...
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-section-header">
        <h2>Gestión de Órdenes</h2>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.order_number}</td>
                <td>{order.customer}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>{formatPrice(order.total)}</td>
                <td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
                <td>
                  <button className="btn btn-ghost btn-sm">Ver</button>
                  <button className="btn btn-primary btn-sm">Cambiar Estado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
