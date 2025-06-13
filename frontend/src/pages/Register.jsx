import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    
    // Email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Full Name (opcional pero si se proporciona debe ser válido)
    if (formData.full_name && formData.full_name.length < 2) {
      newErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Phone (opcional pero si se proporciona debe ser válido)
    if (formData.phone && formData.phone.length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 caracteres';
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
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        setRegistrationSuccessMessage('¡Registro exitoso! Serás redirigido al login en 5 segundos.');
        setTimeout(() => {
          navigate('/login', {
            state: { from: location.state?.from }
          });
        }, 5000);
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
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <div className="form-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a TuMandadoMarket y comienza a comprar</p>
        </div>

        {registrationSuccessMessage && (
          <div className="success-message" style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--success-background)', color: 'var(--success-text)', borderRadius: 'var(--border-radius)', marginBottom: 'var(--spacing-lg)' }}>
            <p>{registrationSuccessMessage}</p>
            <p><Link to="/login" state={{ from: location.state?.from }} className="link-primary">Ir a Iniciar Sesión ahora</Link></p>
          </div>
        )}

        {!registrationSuccessMessage && (
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="tu@email.com"
                disabled={isLoading}
                required
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="full_name">Nombre Completo (opcional)</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={errors.full_name ? 'error' : ''}
                placeholder="Tu nombre completo"
                disabled={isLoading}
                aria-describedby={errors.full_name ? "full_name-error" : undefined}
              />
              {errors.full_name && (
                <span id="full_name-error" className="field-error">{errors.full_name}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                  required
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-sm password-toggle"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="field-error">{errors.password}</span>
              )}
              <div className="password-strength-meter-placeholder" style={{ height: '10px', backgroundColor: '#eee', marginTop: '5px', borderRadius: 'var(--border-radius)' }}>
                {/* TODO: Implement actual password strength meter UI and logic */}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Repite tu contraseña"
                  disabled={isLoading}
                  required
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="btn btn-ghost btn-sm password-toggle"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  aria-pressed={showConfirmPassword}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono (opcional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+54 11 1234-5678"
              disabled={isLoading}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <span id="phone-error" className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección (opcional)</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Tu dirección completa"
              disabled={isLoading}
              rows="3"
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            {errors.address && (
              <span id="address-error" className="field-error">{errors.address}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="link-primary"
              style={{ textDecoration: 'none', fontWeight: '500' }}
            >
              Inicia sesión aquí
            </Link>
          </p>

          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--background-secondary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            * Campos requeridos<br/>
            Al registrarte, aceptas nuestros <Link to="/terms" className="link-inline">términos y condiciones</Link>.
          </div>
        </div>
        )} {/* End conditional rendering of form */}
      </div>
    </div>
  );
};

export default Register;
