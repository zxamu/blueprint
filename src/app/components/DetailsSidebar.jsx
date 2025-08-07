'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // 1. Importar el hook de autenticación

export function DetailsSidebar({ plano, onSave }) {
  const { user } = useAuth(); // 2. Obtener el usuario del contexto
  const [material, setMaterial] = useState(plano.material || '');
  const [maquina, setMaquina] = useState(plano.maquina || '');
  const [notas, setNotas] = useState(plano.notas || '');
  const [isSaving, setIsSaving] = useState(false);

  // Determinar si el usuario tiene permisos de escritura
  const canWrite = user && (user.rol === 'administrador' || user.rol === 'lectura y escritura');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWrite) return; // Seguridad extra
    setIsSaving(true);
    await onSave({ material, maquina, notas });
    setIsSaving(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4 truncate">{plano.alias}</h2>
      
      {/* --- Detalles Fijos --- */}
      <div className="space-y-3 mb-6 text-sm">
        <p className='text-white'><strong className="text-gray-400">Cliente:</strong> {plano.cliente_nombre}</p>
        <p className='text-white'><strong className="text-gray-400">Nombre Archivo:</strong> <span className="break-all">{plano.nombre_archivo}</span></p>
        <p className='text-white'><strong className="text-gray-400">Subido:</strong> {new Date(plano.fecha_subida).toLocaleDateString()}</p>
      </div>

      <hr className="mb-6 border-gray-700"/>

      {/* --- Formulario de Detalles Editables --- */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="space-y-4 flex-grow">
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-300">Material</label>
            <input
              type="text"
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              disabled={!canWrite} // 3. Deshabilitar si no tiene permisos
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm disabled:opacity-50"
              placeholder={canWrite ? "Ej: Acero inoxidable 304" : "No editable"}
            />
          </div>
          <div>
            <label htmlFor="maquina" className="block text-sm font-medium text-gray-300">Máquina de Corte</label>
            <input
              type="text"
              id="maquina"
              value={maquina}
              onChange={(e) => setMaquina(e.target.value)}
              disabled={!canWrite} // 3. Deshabilitar si no tiene permisos
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm disabled:opacity-50"
              placeholder={canWrite ? "Ej: Láser Fibra 3kW" : "No editable"}
            />
          </div>
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-300">Notas Adicionales</label>
            <textarea
              id="notas"
              rows="4"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={!canWrite} // 3. Deshabilitar si no tiene permisos
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm disabled:opacity-50"
              placeholder={canWrite ? "Detalles de producción, etc." : "No editable"}
            ></textarea>
          </div>
        </div>

        {/* 4. Renderizado condicional del botón de guardar */}
        {canWrite && (
          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        )}
      </form>
    </div>
  );
}
