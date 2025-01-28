import { useState } from 'react';
import Link from 'next/link';
import { Home, Users, UserPlus, DollarSign, Menu, User } from 'lucide-react';

export default function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Inicio', icon: <Home className="h-5 w-5" /> },
    { href: '/propietarios', label: 'Propietarios', icon: <Users className="h-5 w-5" /> },
    { href: '/apartamentos', label: 'Apartamentos', icon: <Home className="h-5 w-5" /> },
    { href: '/visitantes', label: 'Visitantes', icon: <UserPlus className="h-5 w-5" /> },
    { href: '/Pagos', label: 'Pagos', icon: <DollarSign className="h-5 w-5" /> },
    { href: '/administradores', label: 'Administradores', icon: <User className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="p-6">
          <h2 className="text-xl font-bold text-gray-200 mb-8">Menú</h2>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 rounded-lg transition duration-300 ease-in-out hover:bg-gray-700 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Icono de la oreja (menú) */}
      <div
        onClick={toggleSidebar}
        className={`fixed top-[8%] transform -translate-y-1/2 bg-white text-black p-2 rounded-r-lg shadow-2x1 cursor-pointer z-50 hover:bg-green-600 transition-all duration-300 ${
          isSidebarOpen ? 'left-[218px]' : 'left-0'
        }`}
      >
        <Menu className="h-7 w-7" />
      </div>

      {/* Overlay (Fondo oscurecido cuando el sidebar está abierto) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-75 z-30"
        ></div>
      )}
    </div>
  );
}
