import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulamos datos por ahora
      const mockUsers = [
        {
          id: 1,
          email: 'admin@test.com',
          full_name: 'Administrador',
          role: 'admin',
          created_at: '2024-01-01T00:00:00Z',
          last_sign_in: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          email: 'cliente@test.com',
          full_name: 'Cliente de Prueba',
          role: 'customer',
          created_at: '2024-01-05T00:00:00Z',
          last_sign_in: '2024-01-14T15:20:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role) => {
    const roleMap = {
      admin: 'Administrador',
      customer: 'Cliente'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="loading">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <h2>Gestión de Usuarios</h2>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Registro</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
                <td>
                  {user.last_sign_in 
                    ? new Date(user.last_sign_in).toLocaleDateString('es-ES')
                    : 'Nunca'
                  }
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">Ver</button>
                  <button className="btn btn-secondary btn-sm">Cambiar Rol</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
