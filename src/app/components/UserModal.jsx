'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'solo lectura',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '', // La contraseña siempre está vacía por seguridad
        rol: user.rol || 'solo lectura',
      });
    } else {
      setFormData({ nombre: '', email: '', password: '', rol: 'solo lectura' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    
    // Validar que la contraseña esté presente al crear un nuevo usuario
    if (!user && !formData.password) {
        setError('La contraseña es obligatoria para nuevos usuarios.');
        setIsSaving(false);
        return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre Completo</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={user ? 'Dejar en blanco para no cambiar' : 'Requerido'} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2" />
          </div>
          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-300">Rol</label>
            <select name="rol" value={formData.rol} onChange={handleChange} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2">
              <option value="solo lectura">Solo Lectura</option>
              <option value="lectura y escritura">Lectura y Escritura</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-md text-white">Cancelar</button>
            <button type="submit" disabled={isSaving} className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white disabled:bg-indigo-400">
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
