'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext'; // 1. Se importa el hook de autenticación

const VersionCard = dynamic(
  () => import('./VersionCard').then(mod => mod.VersionCard),
  {
    ssr: false,
    loading: () => <div className="w-32 h-full bg-gray-800 rounded animate-pulse"></div>
  }
);

// Este componente no se modifica
function ViewTabs() {
  return (
    <div className="flex border-b border-gray-800">
      <button className="py-2 px-4 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600">
        Dibujo
      </button>
      <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
        Pedidos
      </button>
    </div>
  );
}

export function VersionManager({ plano, onVersionAdded, selectedVersionFile, onVersionSelect }) {
  const { user } = useAuth(); // 2. Se obtiene el usuario del contexto
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Se define la condición para verificar si el usuario puede escribir
  const canWrite = user && (user.rol === 'administrador' || user.rol === 'lectura y escritura');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('plano_version', file);

    try {
      const res = await fetch(`/api/planos/${plano.id}/versiones`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Error al subir la nueva versión.');
      onVersionAdded();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full bg-gray-800 flex flex-col h-40">
      <div className="flex-grow p-4 flex items-center space-x-4 overflow-x-auto">
        {/* 3. Se añade la condición para mostrar el botón solo si el usuario tiene permisos */}
        {canWrite && (
          <>
            <button
              onClick={handleAddClick}
              disabled={isUploading}
              className="flex-shrink-0 w-20 h-20 bg-indigo-600 hover:bg-indigo-200 rounded-lg flex flex-col items-center justify-center text-white"
              title="Agregar nueva versión"
            >
              {isUploading ? <p className="text-xs">Subiendo...</p> : <FaPlus size={20} />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
            />
          </>
        )}
        
        {/* El resto del componente no se modifica */}
        <div className="flex items-center space-x-4">
          {[...plano.versiones].reverse().map((version) => (
            <VersionCard
              key={version.id}
              version={version}
              isSelected={version.nombre_archivo_version === selectedVersionFile}
              onClick={() => onVersionSelect(version.nombre_archivo_version)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
