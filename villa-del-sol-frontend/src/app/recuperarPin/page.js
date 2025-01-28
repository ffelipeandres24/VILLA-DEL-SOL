'use client';

import React, { useState } from 'react';
import axios from 'axios';

const RecuperarPin = () => {
  const [nombre, setNombre] = useState('');
  const [nuevoPin, setNuevoPin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevoPin.length < 4) {
      setError('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('http://localhost:4000/api/auth/recuperar-pin', { nombre, nuevoPin });
      setMensaje(response.data.message);
      setError('');
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
          {/** Ícono */}
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
                d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">Recuperar PIN</h2>
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
              <label htmlFor="nuevoPin" className="block text-xs sm:text-sm font-medium text-gray-300">
                Nuevo PIN:
              </label>
              <input
                type="password"
                id="nuevoPin"
                value={nuevoPin}
                onChange={(e) => setNuevoPin(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 sm:p-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-300 text-xs sm:text-base"
            >
              Recuperar PIN
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-center text-red-400 text-xs sm:text-sm">{error}</p>}

        {mensaje && (
          <div className="mt-6 text-center">
            <p className="text-green-400 text-xs sm:text-sm">{mensaje}</p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg transition duration-300 text-xs sm:text-base"
            >
              Ir a Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarPin;
