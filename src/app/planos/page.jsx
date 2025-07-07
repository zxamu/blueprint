'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 1. IMPORTACIÓN DINÁMICA
// Se importa el componente de la tarjeta de forma dinámica para que solo se cargue en el navegador.
const ClientPdfCard = dynamic(
  () => import('../components/ClientPdfCard').then((mod) => mod.ClientPdfCard),
  {
    ssr: false, // 2. Se deshabilita el renderizado del lado del servidor (SSR) para este componente.
    // 3. Se muestra un esqueleto de carga mientras el componente real se carga.
    loading: () => <div className="border rounded-lg h-[448px] bg-gray-200 animate-pulse"></div>,
  }
);

export default function PlanosPage() {
  const [planos, setPlanos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para los filtros
  const [busqueda, setBusqueda] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [fecha, setFecha] = useState('');

  // Hook para obtener los clientes
  useEffect(() => {
    async function fetchClientes() {
      try {
        const clientesRes = await fetch('/api/clientes');
        if (!clientesRes.ok) throw new Error('No se pudieron cargar los clientes.');
        const clientesData = await clientesRes.json();
        setClientes(clientesData);
      } catch (err) {
        setError(err.message);
        setClientes([]); // Asegurarnos que sea un array vacío en caso de error
      }
    }
    fetchClientes();
  }, []);

  // Hook para obtener los planos
  const fetchPlanos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append('busqueda', busqueda);
      if (clienteId) params.append('clienteId', clienteId);
      if (fecha) params.append('fecha', fecha);

      const planosRes = await fetch(`/api/planos?${params.toString()}`);
      if (!planosRes.ok) throw new Error('No se pudieron cargar los planos.');

      const planosData = await planosRes.json();
      setPlanos(planosData);
    } catch (err) {
      setError(err.message);
      setPlanos([]);
    } finally {
      setLoading(false);
    }
  }, [busqueda, clienteId, fecha]);

  useEffect(() => {
    fetchPlanos();
  }, [fetchPlanos]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Lista de Planos</h1>
        <Link href="/planos/nuevo" className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
            + Agregar Plano
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Buscar por alias o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option className='text-gray-600' value="">Todos los clientes</option>
          {Array.isArray(clientes) && clientes.map(cliente => (
            <option className='text-gray-600' key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Cargando planos...</p>
      ) : planos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {planos.map((plano) => (
            // 4. Se utiliza el componente cargado dinámicamente
            <ClientPdfCard key={plano.id} plano={plano} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No se encontraron planos. ¡Prueba a agregar uno!</p>
      )}
    </div>
  );
}