'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/layout'; 

export default function Inicio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  return (
    <Layout>
      <div
        className="min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            'url("https://estag.fimagenes.com/imagenesred/10608546.jpg")',
          filter: 'brightness(0.9)',
        }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="text-gray-900 mb-8">
            <h1 className="text-5xl font-extrabold mb-4">
              Sistema Administrativo Villa del Sol
            </h1>
            <p className="text-lg">
              Administra eficientemente el conjunto residencial con herramientas modernas y seguras.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              Mas...
            </button>
          </div>
        </div>

        {isModalOpen ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Bienvenido a Villa del Sol
              </h2>
              <p className="text-gray-700 leading-relaxed text-center mb-6">
                Gestiona propietarios, visitas, administradores y apartamentos de manera sencilla.
              </p>
              <div className="text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="bg-gray-800 text-gray-400 py-2 text-center">
        <p>
          &copy; {new Date().getFullYear()} Villa del Sol. Todos los derechos reservados.
        </p>
        <p className="mt-1">
          Desarrollado por <span className="text-yellow-400">Andres Felipe Rivera</span>.
        </p>
      </footer>
    </Layout>
  );
}
