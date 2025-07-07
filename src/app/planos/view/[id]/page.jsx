'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PdfViewer } from '@/app/components/PdfViewer';
import { DetailsSidebar } from '@/app/components/DetailsSidebar';

export default function ViewPlanoPage() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams(); // Hook para obtener el { id } de la URL

  useEffect(() => {
    if (params.id) {
      const fetchPlanoDetails = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/planos/${params.id}`);
          if (!res.ok) {
            throw new Error('No se pudo cargar la información del plano.');
          }
          const data = await res.json();
          setPlano(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
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

      // Opcional: Actualizar el estado local para reflejar los cambios al instante
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
    <div className="flex w-full h-full gap-6">
      {/* Columna del Visor de PDF */}
      <div className="flex-grow h-full bg-gray-200 rounded-lg">
        <PdfViewer file={plano.nombre_archivo} />
      </div>

      {/* Columna de la Barra de Detalles */}
      <div className="w-96 flex-shrink-0">
        <DetailsSidebar plano={plano} onSave={handleDetailsSave} />
      </div>
    </div>
  );
}