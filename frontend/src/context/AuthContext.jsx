import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { authAPI } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.setItem('supabase_token', session.access_token);
          
          // Obtener perfil del usuario
          const profileResponse = await authAPI.getProfile();
          setUserProfile(profileResponse.data.user.profile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.setItem('supabase_token', session.access_token);
          
          try {
            const profileResponse = await authAPI.getProfile();
            setUserProfile(profileResponse.data.user.profile);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setSession(null);
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem('supabase_token');
          localStorage.removeItem('user_data');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.data.session) {
        const { session, user: userData } = response.data;
        setSession(session);
        setUser(userData);
        setUserProfile(userData.profile);
        localStorage.setItem('supabase_token', session.access_token);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al registrarse' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('supabase_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUserProfile(response.data.profile);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al actualizar perfil' 
      };
    }
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!session;
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
