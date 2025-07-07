import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col h-screen">
      <h2 className="text-2xl text-indigo-700 font-bold mb-8">Blueprints</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link
              href="/planos"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Lista de Planos
            </Link>
          </li>
          <li>
            <Link
              href="/pedidos" // Ruta futura
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Lista de Pedidos
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}