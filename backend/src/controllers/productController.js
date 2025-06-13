const supabase = require('../services/supabaseClient');

// Obtener todos los productos (con filtros opcionales)
const getProducts = async (req, res) => {
  try {
    const { category_id, search, page = 1, limit = 20 } = req.query;
    
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Filtrar por categoría si se especifica
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    // Búsqueda por nombre si se especifica
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Paginación
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json({
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product: data });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo producto (solo admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, image_url, category_id, price, stock } = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        image_url,
        category_id,
        price,
        stock,
        is_active: true
      }])
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al crear producto' });
    }

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: data
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, category_id, price, stock, is_active } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        image_url,
        category_id,
        price,
        stock,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      product: data
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - marcar como inactivo
    const { data, error } = await supabase
      .from('products')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }

    res.json({ categories: data });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
