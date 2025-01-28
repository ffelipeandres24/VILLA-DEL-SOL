'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({ pin: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pin.trim()) {
      setError('Por favor ingrese su PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/login',
        { pin: formData.pin.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        router.push('/');
      } else {
        setError('No se pudo iniciar sesión. Por favor intente nuevamente.');
      }
    } catch (err) {
      setError('PIN incorrecto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 text-white">
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
          <h1 className="text-xl sm:text-2xl font-semibold">Iniciar Sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-400">
              PIN
            </label>
            <div className="relative">
              <input
                type="password"
                id="pin"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                required
                maxLength="6"
                className="w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-3 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 absolute top-3 right-3 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12m8.485-8.485a12 12 0 10-16.97 16.97 12 12 0 0016.97-16.97z"
                />
              </svg>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-400 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link href="/RegistroAdministrador" className="text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </p>
          <p className="mt-2">
            ¿Olvidaste tu PIN?{' '}
            <Link href="/recuperarPin" className="text-blue-500 hover:underline">
              Recupéralo aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
