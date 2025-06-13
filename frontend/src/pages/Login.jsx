import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect después del login
  const from = location.state?.from?.pathname || '/inicio';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect al destino original o home
        navigate(from, { replace: true });
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="form-container">
        <div className="form-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingresa a tu cuenta de TuMandadoMarket</p>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}
            >
              Regístrate aquí
            </Link>
          </p>

          <div style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-secondary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Cuentas de Prueba:
            </h4>
            <div style={{
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Admin:</strong> admin@test.com / 123456
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Cliente:</strong> cliente@test.com / 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
