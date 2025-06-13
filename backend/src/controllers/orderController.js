const supabase = require('../services/supabaseClient');

// Obtener órdenes del usuario
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Si es admin, puede ver todas las órdenes, sino solo las propias
    if (req.userProfile.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    // Paginación
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Error al obtener órdenes' });
    }

    res.json({
      orders: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener orden por ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            description,
            image_url,
            price
          )
        ),
        user_profiles (
          full_name,
          phone,
          address
        )
      `)
      .eq('id', id);

    // Si no es admin, solo puede ver sus propias órdenes
    if (req.userProfile.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({ order: data });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nueva orden
const createOrder = async (req, res) => {
  try {
    const { delivery_address, phone, notes } = req.body;

    // Obtener items del carrito
    const { data: cartItems, error: cartError } = await supabase
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
      .eq('user_id', req.user.id);

    if (cartError) {
      return res.status(500).json({ error: 'Error al obtener carrito' });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar stock y productos activos
    for (const item of cartItems) {
      if (!item.products.is_active) {
        return res.status(400).json({ 
          error: `El producto ${item.products.name} ya no está disponible` 
        });
      }
      if (item.products.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${item.products.name}` 
        });
      }
    }

    // Calcular total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.products.price);
    }, 0);

    // Crear la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: req.user.id,
        total_amount: totalAmount,
        delivery_address,
        phone,
        notes,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      return res.status(500).json({ error: 'Error al crear orden' });
    }

    // Crear items de la orden
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.products.price,
      total_price: item.quantity * item.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Si falla, eliminar la orden creada
      await supabase.from('orders').delete().eq('id', order.id);
      return res.status(500).json({ error: 'Error al crear items de la orden' });
    }

    // Actualizar stock de productos
    for (const item of cartItems) {
      await supabase
        .from('products')
        .update({ 
          stock: item.products.stock - item.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.product_id);
    }

    // Limpiar carrito
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    // Obtener orden completa con items
    const { data: completeOrder, error: completeError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            description,
            image_url
          )
        )
      `)
      .eq('id', order.id)
      .single();

    if (completeError) {
      return res.status(500).json({ error: 'Error al obtener orden completa' });
    }

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order: completeOrder
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar estado de orden (solo admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado de orden inválido' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({
      message: 'Estado de orden actualizado exitosamente',
      order: data
    });
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};
