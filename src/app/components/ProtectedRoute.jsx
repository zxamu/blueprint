'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Componente para proteger rutas del lado del cliente.
 * Redirige a /login si el usuario no está autenticado.
 * Si `adminOnly` es true, redirige a /planos si el usuario no es administrador.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return; // Esperar a que se cargue el estado de autenticación
        }

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (adminOnly && user.rol !== 'administrador') {
            router.push('/planos');
        }

    }, [isAuthenticated, user, loading, router, adminOnly]);

    // Muestra un estado de carga mientras se verifica la sesión
    if (loading || !isAuthenticated) {
        return <p className="text-center mt-20 text-gray-400">Verificando sesión...</p>;
    }

    // Muestra un mensaje mientras redirige si el rol no es el correcto
    if (adminOnly && user.rol !== 'administrador') {
        return <p className="text-center mt-20 text-gray-400">Acceso no autorizado. Redirigiendo...</p>;
    }

    // Si todo está en orden, muestra el contenido de la página
    return children;
}
