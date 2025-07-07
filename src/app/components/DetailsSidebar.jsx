'use client';

import { useState } from 'react';

export function DetailsSidebar({ plano, onSave }) {
  const [material, setMaterial] = useState(plano.material || '');
  const [maquina, setMaquina] = useState(plano.maquina || '');
  const [notas, setNotas] = useState(plano.notas || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({ material, maquina, notas });
    setIsSaving(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 truncate text-white">{plano.alias}</h2>
      
      {/* --- Detalles Fijos --- */}
      <div className="space-y-3 mb-6 text-sm">
        <p className='text-white'><strong className="text-gray-200">Cliente:</strong> {plano.cliente_nombre}</p>
        <p className='text-white'><strong className="text-gray-200">Nombre Archivo:</strong> <span className="break-all">{plano.nombre_archivo}</span></p>
        <p className='text-white'><strong className="text-gray-200">Subido:</strong> {new Date(plano.fecha_subida).toLocaleDateString()}</p>
      </div>

      <hr className="mb-6"/>

      {/* --- Formulario de Detalles Editables --- */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="space-y-4 flex-grow">
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-200">Material</label>
            <input
              type="text"
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ej: Acero inoxidable 304"
            />
          </div>
          <div>
            <label htmlFor="maquina" className="block text-sm font-medium text-gray-200">Máquina de Corte</label>
            <input
              type="text"
              id="maquina"
              value={maquina}
              onChange={(e) => setMaquina(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ej: Láser Fibra 3kW"
            />
          </div>
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-200">Notas Adicionales</label>
            <textarea
              id="notas"
              rows="4"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Detalles de producción, precauciones, etc."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}