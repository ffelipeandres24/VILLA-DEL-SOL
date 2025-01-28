'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegistroAdministrador = () => {
  const [nombre, setNombre] = useState('');
  const [pin, setPin] = useState('');
const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/registro', { nombre, pin });
      setMensaje(response.data.message);
      setError('');
      setModalVisible(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error desconocido');
      setMensaje('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12c2.28 0 4.5-1.28 4.5-3S14.28 6 12 6s-4.5 1.28-4.5 3 2.22 3 4.5 3zM8.21 14.19a9.155 9.155 0 017.58 0M6 18c0-1.88 2.69-3.43 6-3.43S18 16.12 18 18"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">Registro Administrador</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-300 text-sm sm:text-lg font-semibold">Cargando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-xs sm:text-sm font-medium text-gray-300">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 sm:p-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="pin" className="block text-xs sm:text-sm font-medium text-gray-300">
                PIN:
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 sm:p-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-300 text-xs sm:text-base"
            >
              Registrar
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-center text-red-400 text-xs sm:text-sm">{error}</p>}
        {mensaje && <p className="mt-4 text-center text-green-400 text-xs sm:text-sm">{mensaje}</p>}

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-11/12 max-w-sm sm:max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-center mb-4">¡Registro Exitoso!</h3>
            <p className="text-center text-sm sm:text-base mb-6">
              Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.
            </p>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroAdministrador;
