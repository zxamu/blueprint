'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PdfViewer } from '@/app/components/PdfViewer';
import { DetailsSidebar } from '@/app/components/DetailsSidebar';
import { VersionManager } from '@/app/components/VersionManager';

export default function ViewPlanoPage() {
  const [plano, setPlano] = useState(null);
  const [selectedVersionFile, setSelectedVersionFile] = useState(null); // Estado para la versión activa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

  const fetchPlanoDetails = useCallback(async () => {
    if (params.id) {
      // No mostramos el loader en un refresh, solo en la carga inicial
      if (!plano) setLoading(true); 
      try {
        const res = await fetch(`/api/planos/${params.id}`);
        if (!res.ok) throw new Error('No se pudo cargar la información del plano.');
        const data = await res.json();
        setPlano(data);

        // Por defecto, selecciona la versión más reciente
        if (data.versiones && data.versiones.length > 0) {
          // La API devuelve las versiones de más antigua a más nueva, la última es la más reciente.
          const masReciente = data.versiones[data.versiones.length - 1];
          setSelectedVersionFile(masReciente.nombre_archivo_version);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id, plano]); // 'plano' se agrega para evitar warnings de ESLint

  useEffect(() => {
    fetchPlanoDetails();
  }, [params.id]); // Solo se ejecuta cuando el ID cambia

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

  if (loading) return <p className="text-center mt-10">Cargando plano...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!plano) return null;

  return (
    // Layout principal que ocupa toda la pantalla y no permite scroll
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-800">
      {/* --- Sección Superior (Gestor de Versiones) --- */}
      <div className="flex-shrink-0 border-b border-gray-800">
        <VersionManager
          plano={plano}
          onVersionAdded={fetchPlanoDetails}
          selectedVersionFile={selectedVersionFile}
          onVersionSelect={setSelectedVersionFile} // Pasamos la función para cambiar la versión
        />
      </div>

      {/* --- Sección Inferior (Visor y Detalles) --- */}
      <div className="flex-grow flex gap-6 p-6 overflow-hidden">
        {/* Columna del Visor de PDF (ocupa el espacio restante) */}
        <div className="flex-grow h-full bg-gray-200 rounded-lg overflow-hidden">
          {selectedVersionFile && <PdfViewer file={selectedVersionFile} />}
        </div>
        {/* Columna de la Barra de Detalles (ancho fijo) */}
        <div className="w-96 flex-shrink-0 h-full">
          <DetailsSidebar plano={plano} onSave={handleDetailsSave} />
        </div>
      </div>
    </div>
  );
}