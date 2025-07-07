'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoPlanoPage() {
  const [alias, setAlias] = useState('');
  const [cliente, setCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !alias || !cliente) {
      setError('Por favor, completa los campos de alias, cliente y selecciona un archivo.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('plano', file);
    formData.append('alias', alias);
    formData.append('cliente', cliente);
    formData.append('descripcion', descripcion);

    try {
      const response = await fetch('/api/planos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir el archivo');
      }

      router.push('/planos'); // Redirige a la lista de planos
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-white-900">Agregar Nuevo Plano</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="alias" className="block text-sm font-medium text-white-700">
            Alias del Plano (Nombre para mostrar)
          </label>
          <input
            type="text"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-white-700">
            Nombre del Cliente
          </label>
          <input
            type="text"
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
         <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-white-700">
            Descripción (Opcional)
          </label>
          <textarea
            id="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="plano" className="block text-sm font-medium text-white-700">
            Archivo del Plano (PDF)
          </label>
          <input
            type="file"
            id="plano"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Subiendo...' : 'Guardar Plano'}
          </button>
        </div>
      </form>
    </div>
  );
}