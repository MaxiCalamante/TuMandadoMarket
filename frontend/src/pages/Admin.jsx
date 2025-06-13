import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminOrders from '../components/admin/AdminOrders';

const Admin = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'categories', label: 'Categorías', icon: '🏷️' },
    { id: 'orders', label: 'Órdenes', icon: '📋' },
    { id: 'users', label: 'Usuarios', icon: '👥' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {userProfile?.full_name || 'Administrador'}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav">
          <div className="admin-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
