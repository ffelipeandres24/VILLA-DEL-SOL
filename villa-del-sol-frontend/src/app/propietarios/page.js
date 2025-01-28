


'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import { Plus } from 'lucide-react';

export default function Propietarios() {
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getToken = () => localStorage.getItem('token');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  // Cargar propietarios al montar el componente
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('No se proporcionó token de autorización.');
      setLoading(false);
      return;
    }

    fetchPropietarios(token);
  }, []);

  const fetchPropietarios = async (token) => {
    try {
      const response = await axios.get('http://localhost:4000/api/propietarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPropietarios(response.data.data);
    } catch (err) {
      if (err.response?.status === 401 && err.response.data.message === 'Token vencido') {
        await refreshAuthToken();
      } else {
        setError('Hubo un error al cargar los propietarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setError('No se proporcionó un nuevo token.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/refresh', { refreshToken });
      localStorage.setItem('token', response.data.data.token);
      await fetchPropietarios(response.data.data.token);
    } catch {
      setError('Hubo un error al renovar el token.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nombre, email };
    const token = getToken();

    if (!token) {
      setError('No se proporcionó token de autorización.');
      return;
    }

    const url = editingId
      ? `http://localhost:4000/api/propietarios/${editingId}`
      : 'http://localhost:4000/api/propietarios/register';
    const method = editingId ? 'put' : 'post';

    try {
      const response = await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (editingId) {
        setPropietarios((prev) =>
          prev.map((p) => (p.id === editingId ? response.data.data : p))
        );
      } else {
        setPropietarios((prev) => [...prev, response.data.data]);
      }
      closeModal();
    } catch {
      setError('Hubo un error al procesar la solicitud.');
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      setError('No se proporcionó token de autorización.');
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/propietarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPropietarios((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Hubo un error al eliminar el propietario.');
    }
  };

  const openModal = (id = null) => {
    if (id) {
      const propietario = propietarios.find((p) => p.id === id);
      if (propietario) {
        setNombre(propietario.nombre);
        setEmail(propietario.email);
        setEditingId(id);
      }
    } else {
      setNombre('');
      setEmail('');
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNombre('');
    setEmail('');
    setEditingId(null);
  };

  if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
            </div>
            <p className="ml-4 text-white text-lg font-semibold">Cargando...</p>
          </div>
        );
      }
      
      if (error) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.878 4.122a3.001 3.001 0 014.244 0l6.756 6.756a3.001 3.001 0 010 4.244l-6.756 6.756a3.001 3.001 0 01-4.244 0L4.122 15.122a3.001 3.001 0 010-4.244l6.756-6.756z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 9l-6 6m0-6l6 6"
                  />
                </svg>
              </div>
              <p className="text-center text-red-400 text-lg font-semibold">
                Ocurrió un error: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                Reintentar
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <Layout>
          {/* Fondo personalizable */}
          <div
            className="min-h-screen bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://www.shutterstock.com/image-photo/close-agent-giving-key-new-260nw-2476457371.jpg")', // Cambia la URL por tu imagen
            }}
          >
            <div className="bg-black bg-opacity-70 min-h-screen p-6">
              {/* Título mejorado */}
              <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-6 tracking-wide font-sans">
                Control de Propietarios
              </h1>
    
              {/* Botón de Registrar */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={openModal}
                  className="flex items-center bg-green-900 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Registrar Nuevo propietario</span>
                </button>
              </div>
    
              {/* Modal para Registrar o Editar */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
                  <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                    <h2 className="text-xl font-semibold text-white mb-6">
                      {editingId ? 'Actualizar Propietario' : 'Registrar Propietario'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-gray-300">Nombre</label>
                        <input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Nombre del propietario"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Email del propietario"
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center space-x-2"
                        >
                          {editingId ? 'Actualizar' : 'Registrar'}
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
    
              {/* Tabla de Propietarios */}
              <h2 className="text-3xl font-bold text-center text-gray-100 mt-7 mb-4">Lista de Propietarios</h2>
              <div className="overflow-hidden bg-gray-800 bg-opacity-80 shadow-lg rounded-lg mt-6">
                <table className="min-w-full table-auto text-gray-300">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-6 text-sm font-semibold text-left">ID</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Nombre</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Email</th>
                      <th className="py-3 px-6 text-sm font-semibold text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propietarios.map((propietario) => (
                      <tr key={propietario.id} className="border-b border-gray-700 hover:bg-gray-800">
                        <td className="py-3 px-6 text-sm text-left">{propietario.id}</td>
                        <td className="py-3 px-6 text-sm text-left">{propietario.nombre}</td>
                        <td className="py-3 px-6 text-sm text-left">{propietario.email}</td>
                        <td className="py-3 px-6 text-sm text-left">
                          <button
                            onClick={() => openModal(propietario.id)}
                            className="bg-green-900 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105 mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(propietario.id)}
                            className="bg-red-900 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Layout>
      );
    }
