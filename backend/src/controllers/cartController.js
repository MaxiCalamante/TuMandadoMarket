const supabase = require('../services/supabaseClient');

// Obtener carrito del usuario
const getCart = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          description,
          image_url,
          price,
          stock,
          is_active
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Error al obtener carrito' });
    }

    // Calcular total del carrito
    const total = data.reduce((sum, item) => {
      if (item.products && item.products.is_active) {
        return sum + (item.quantity * item.products.price);
      }
      return sum;
    }, 0);

    res.json({
      cart_items: data,
      total: parseFloat(total.toFixed(2)),
      item_count: data.length
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Agregar producto al carrito
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Verificar que el producto existe y está activo
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Verificar si el producto ya está en el carrito
    const { data: existingItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    let result;

    if (existingItem) {
      // Actualizar cantidad si ya existe
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Stock insuficiente para la cantidad solicitada' });
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select(`
          *,
          products (
            id,
            name,
            description,
            image_url,
            price,
            stock,
            is_active
          )
        `)
        .single();

      if (error) {
        return res.status(500).json({ error: 'Error al actualizar carrito' });
      }

      result = data;
    } else {
      // Crear nuevo item en el carrito
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: req.user.id,
          product_id,
          quantity
        }])
        .select(`
          *,
          products (
            id,
            name,
            description,
            image_url,
            price,
            stock,
            is_active
          )
        `)
        .single();

      if (error) {
        return res.status(500).json({ error: 'Error al agregar al carrito' });
      }

      result = data;
    }

    res.status(201).json({
      message: 'Producto agregado al carrito exitosamente',
      cart_item: result
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar cantidad de producto en carrito
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Obtener el item del carrito con información del producto
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          stock,
          is_active
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (cartError || !cartItem) {
      return res.status(404).json({ error: 'Item del carrito no encontrado' });
    }

    // Verificar stock disponible
    if (cartItem.products.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Actualizar cantidad
    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        products (
          id,
          name,
          description,
          image_url,
          price,
          stock,
          is_active
        )
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al actualizar carrito' });
    }

    res.json({
      message: 'Carrito actualizado exitosamente',
      cart_item: data
    });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: 'Error al eliminar del carrito' });
    }

    res.json({ message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Limpiar carrito completo
const clearCart = async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: 'Error al limpiar carrito' });
    }

    res.json({ message: 'Carrito limpiado exitosamente' });
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
