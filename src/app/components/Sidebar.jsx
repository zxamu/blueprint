'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { FaSignOutAlt, FaUsersCog, FaFilePdf, FaClipboardList } from 'react-icons/fa';

export function Sidebar() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // No renderizar nada mientras se carga el estado o si no está autenticado
  if (loading || !isAuthenticated) {
    return null;
  }
  
  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col h-screen text-white shadow-lg">
      <h2 className="text-2xl text-indigo-400 font-bold mb-8">Blueprints</h2>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link href="/planos" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${pathname.startsWith('/planos') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              <FaFilePdf />
              <span>Lista de Planos</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/pedidos" className={`flex items-center gap-3 py-2 px-4 rounded transition-colors ${pathname.startsWith('/pedidos') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              <FaClipboardList />
              <span>Lista de Pedidos</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {user && (
        <div className="mt-auto">
          {user.rol === 'administrador' && (
             <Link href="/usuarios" className={`flex items-center gap-3 text-sm py-2 px-4 rounded transition-colors mb-4 ${pathname.startsWith('/usuarios') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <FaUsersCog />
                <span>Gestionar Usuarios</span>
             </Link>
          )}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm font-semibold truncate">{user.nombre}</p>
            <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
            <button onClick={logout} className="w-full text-left mt-3 flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors">
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
