'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PdfViewer } from '@/app/components/PdfViewer';
import { DetailsSidebar } from '@/app/components/DetailsSidebar';
import { VersionManager } from '@/app/components/VersionManager';
import ProtectedRoute from '@/app/components/ProtectedRoute'; // 1. Importar el componente de protección

export default function ViewPlanoPage() {
  const [plano, setPlano] = useState(null);
  const [selectedVersionFile, setSelectedVersionFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

  const fetchPlanoDetails = useCallback(async () => {
    if (params.id) {
      // Solo mostrar el loader principal en la carga inicial
      if (!plano) setLoading(true); 
      try {
        const res = await fetch(`/api/planos/${params.id}`);
        if (!res.ok) throw new Error('No se pudo cargar la información del plano.');
        const data = await res.json();
        setPlano(data);

        // Al cargar o refrescar, establecer la versión más reciente por defecto
        if (data.versiones && data.versiones.length > 0) {
          const masReciente = data.versiones[data.versiones.length - 1];
          setSelectedVersionFile(masReciente.nombre_archivo_version);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id, plano]);

  // Se ejecuta solo cuando el ID de la URL cambia
  useEffect(() => {
    if (params.id) {
        fetchPlanoDetails();
    }
  }, [params.id]);

  const handleDetailsSave = async (updatedDetails) => {
    try {
      const res = await fetch(`/api/planos/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDetails),
      });
      if (!res.ok) throw new Error('Error al guardar los cambios.');
      setPlano(prev => ({ ...prev, ...updatedDetails }));
      alert('¡Detalles guardados con éxito!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    // 2. Envolver todo el contenido con el componente ProtectedRoute
    <ProtectedRoute>
        {/* Renderizado condicional para mostrar el contenido solo después de la carga y sin errores */}
        {loading && <p className="text-center mt-10 text-gray-400">Cargando plano...</p>}
        {error && <p className="text-center mt-10 text-red-500">{error}</p>}
        
        {/* Una vez que el plano ha cargado, se muestra la interfaz principal */}
        {plano && (
            <div className="flex flex-col w-full h-full max-h-screen overflow-hidden bg-gray-900">
                {/* Sección Superior (Gestor de Versiones) */}
                <div className="flex-shrink-0 border-b border-gray-700">
                    <VersionManager
                        plano={plano}
                        onVersionAdded={fetchPlanoDetails}
                        selectedVersionFile={selectedVersionFile}
                        onVersionSelect={setSelectedVersionFile}
                    />
                </div>
                {/* Sección Inferior (Visor y Detalles) */}
                <div className="flex-grow flex gap-6 p-6 overflow-hidden">
                    <div className="flex-grow h-full bg-gray-200 rounded-lg overflow-hidden">
                        {selectedVersionFile && <PdfViewer file={selectedVersionFile} />}
                    </div>
                    <div className="w-96 flex-shrink-0 h-full">
                        <DetailsSidebar plano={plano} onSave={handleDetailsSave} />
                    </div>
                </div>
            </div>
        )}
    </ProtectedRoute>
  );
}
