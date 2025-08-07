'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../components/ProtectedRoute'; // 1. Importar el componente de protección
import { useAuth } from '@/context/AuthContext'; // 2. Importar el hook de autenticación

const ClientPdfCard = dynamic(
  () => import('../components/ClientPdfCard').then((mod) => mod.ClientPdfCard),
  {
    ssr: false,
    loading: () => <div className="border rounded-lg h-[448px] bg-gray-700 animate-pulse"></div>,
  }
);

export default function PlanosPage() {
  const { user } = useAuth(); // 3. Obtener el usuario actual del contexto
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
        setClientes([]);
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

  // 4. Definir la condición de permisos de escritura
  const canWrite = user && (user.rol === 'administrador' || user.rol === 'lectura y escritura');

  return (
    // 5. Envolver toda la página con el componente ProtectedRoute
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Lista de Planos</h1>
          {/* 6. Renderizar el botón solo si el usuario tiene permisos de escritura */}
          {canWrite && (
            <Link href="/planos/nuevo" className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                + Agregar Plano
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Buscar por alias o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="">Todos los clientes</option>
            {Array.isArray(clientes) && clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Cargando planos...</p>
        ) : planos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {planos.map((plano) => (
              <ClientPdfCard key={plano.id} plano={plano} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No se encontraron planos. ¡Prueba a agregar uno!</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
