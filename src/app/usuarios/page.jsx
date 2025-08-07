'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { UserModal } from '../components/UserModal';
import ProtectedRoute from '../components/ProtectedRoute'; // 1. Importar el componente

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios');
      if (!res.ok) throw new Error('No se pudieron cargar los usuarios.');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData) => {
    const url = selectedUser ? `/api/usuarios/${selectedUser.id}` : '/api/usuarios';
    const method = selectedUser ? 'PATCH' : 'POST';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'No se pudo guardar el usuario.');
    }
    
    await fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
          try {
              const res = await fetch(`/api/usuarios/${userId}`, { method: 'DELETE' });
              if (!res.ok) {
                  const errorData = await res.json();
                  throw new Error(errorData.error || 'No se pudo eliminar el usuario.');
              }
              await fetchUsers();
          } catch (err) {
              alert(err.message);
          }
      }
  };

  return (
    // 2. Envolver todo con ProtectedRoute, especificando adminOnly
    <ProtectedRoute adminOnly={true}>
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Gestionar Usuarios</h1>
                <button onClick={() => handleOpenModal()} className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2">
                    <FaPlus />
                    <span>Crear Usuario</span>
                </button>
            </div>

            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-red-400">{error}</p>}
            
            <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nombre</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Rol</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-700">
                                <td className="px-5 py-4 border-b border-gray-700 text-sm">{user.nombre}</td>
                                <td className="px-5 py-4 border-b border-gray-700 text-sm">{user.email}</td>
                                <td className="px-5 py-4 border-b border-gray-700 text-sm capitalize">{user.rol}</td>
                                <td className="px-5 py-4 border-b border-gray-700 text-sm">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(user)} className="text-yellow-400 hover:text-yellow-300" title="Editar"><FaEdit /></button>
                                        {currentUser?.id !== user.id && (
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400" title="Eliminar"><FaTrash /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <UserModal user={selectedUser} onClose={handleCloseModal} onSave={handleSaveUser} />}
        </div>
    </ProtectedRoute>
  );
}
