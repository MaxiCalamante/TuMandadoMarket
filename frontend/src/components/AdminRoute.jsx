import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading">
        Verificando permisos...
      </div>
    );
  }

  if (!user) {
    // Redirigir al login con la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    // Redirigir al inicio si no es admin
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default AdminRoute;
