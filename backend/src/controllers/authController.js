const supabase = require('../services/supabaseClient');

// Registro de usuario
const register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Crear perfil de usuario
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        full_name: full_name || null,
        phone: phone || null,
        address: address || null,
        role: 'customer'
      }])
      .select()
      .single();

    if (profileError) {
      // Si falla la creación del perfil, eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Error al crear perfil de usuario' });
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: profileData
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: 'Error al obtener perfil de usuario' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: data.user.id,
        email: data.user.email,
        profile
      },
      session: data.session
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        profile: req.userProfile
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar perfil del usuario
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        full_name,
        phone,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al actualizar perfil' });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      profile: data
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
