import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          {/* Título del navbar */}
          <div className="text-2xl font-extrabold text-gray-100 tracking-wide cursor-pointer hover:scale-105 transition-transform duration-300 font-mono">
            Villa del Sol
          </div>

          {/* Botón Cerrar Sesión */}
          <div>
            <button
              onClick={handleLogout}
              className="relative inline-flex items-center justify-center px-6 py-2 font-bold text-gray-900 bg-gray-100 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cerrar Sesión
              <span className="absolute w-3 h-3 bg-gray-400 rounded-full animate-ping -top-1 -right-1"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra animada debajo del navbar */}
      <div className="relative h-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900"></div>
    </nav>
  );
}
