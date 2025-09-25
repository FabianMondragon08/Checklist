import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'inspector' | 'supervisor' | 'admin';
  department: string;
  active: boolean;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const { profile, signUp } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'inspector' as 'inspector' | 'supervisor' | 'admin'
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          role,
          department,
          active,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users (this would need to be done via an edge function in production)
      setUsers(data.map(user => ({
        ...user,
        email: 'usuario@empresa.com' // Placeholder - in production, get from auth.users
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
      setFormData({ email: '', password: '', fullName: '', role: 'inspector' });
      setShowCreateForm(false);
      await fetchUsers();
      alert('Usuario creado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (profile?.role !== 'superadmin') {
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'inspector' | 'supervisor' | 'admin' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="inspector">Inspector</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Crear Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuarios Registrados</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Rol</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{user.full_name || 'Sin nombre'}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'supervisor' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' :
                             user.role === 'supervisor' ? 'Supervisor' : 'Inspector'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserStatus(user.id, user.active)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                user.active 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.active ? 'Desactivar' : 'Activar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};