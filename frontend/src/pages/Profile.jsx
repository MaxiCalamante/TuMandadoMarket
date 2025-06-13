import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Profile = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (formData.full_name && formData.full_name.length < 2) {
      newErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (formData.phone && formData.phone.length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        setSuccessMessage('Perfil actualizado exitosamente');
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    setSuccessMessage('');
    
    try {
      // Aquí implementaremos el cambio de contraseña
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Contraseña cambiada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ passwordSubmit: 'Error al cambiar la contraseña. Intenta nuevamente.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="section">
        <div className="section-header">
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y configuración de cuenta</p>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <div className="profile-content">
          {/* Información de la cuenta */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>Información de la Cuenta</h2>
              <p>Tu información básica de usuario</p>
            </div>
            
            <div className="account-info">
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Rol:</label>
                <span className={`role-badge ${userProfile?.role}`}>
                  {userProfile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
              <div className="info-item">
                <label>Miembro desde:</label>
                <span>
                  {userProfile?.created_at 
                    ? new Date(userProfile.created_at).toLocaleDateString('es-ES')
                    : 'No disponible'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de perfil */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>Información Personal</h2>
              <p>Actualiza tu información de contacto</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              {errors.submit && (
                <div className="error-message">
                  {errors.submit}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="full_name">Nombre Completo</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={errors.full_name ? 'error' : ''}
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                />
                {errors.full_name && (
                  <span className="field-error">{errors.full_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+54 11 1234-5678"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Tu dirección completa"
                  disabled={isLoading}
                  rows="3"
                />
                {errors.address && (
                  <span className="field-error">{errors.address}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
              </button>
            </form>
          </div>

          {/* Cambio de contraseña */}
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>Cambiar Contraseña</h2>
              <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              {errors.passwordSubmit && (
                <div className="error-message">
                  {errors.passwordSubmit}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={errors.currentPassword ? 'error' : ''}
                  placeholder="Tu contraseña actual"
                  disabled={isChangingPassword}
                />
                {errors.currentPassword && (
                  <span className="field-error">{errors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={errors.newPassword ? 'error' : ''}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isChangingPassword}
                />
                {errors.newPassword && (
                  <span className="field-error">{errors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Repite la nueva contraseña"
                  disabled={isChangingPassword}
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
