'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/layout'; 
import { useRouter } from 'next/navigation';
import { Plus, Loader } from 'lucide-react';

const ListaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [nombre, setNombre] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const router = useRouter();

  // Función para obtener los administradores desde el backend
  useEffect(() => {
    const fetchAdministradores = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/auth/administradores');
        setAdministradores(response.data.data);
      } catch (err) {
        setError('Error al obtener los administradores');
      } finally {
        setLoading(false);
      }
    };

    fetchAdministradores();
  }, []);

  // Función para eliminar un administrador
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/api/auth/administradores/${id}`);
      setAdministradores(administradores.filter(admin => admin.id !== id));
    } catch (err) {
      setError('Error al eliminar el administrador');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (admin) => {
    setCurrentAdmin(admin);
    setNombre(admin.nombre);
    setPin(admin.pin);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAdmin(null);
    setNombre('');
    setPin('');
  };

  // Función para actualizar los datos del administrador
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/auth/administradores/${currentAdmin.id}`, { nombre, pin });
      setAdministradores(administradores.map(admin => admin.id === currentAdmin.id ? { ...admin, nombre, pin } : admin));
      closeModal();
    } catch (err) {
      setError('Error al actualizar el administrador');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga
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
          <div
            className="min-h-screen bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://www.shutterstock.com/image-photo/close-agent-giving-key-new-260nw-2476457371.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black bg-opacity-70 min-h-screen p-6">
              <div className="w-full max-w-4xl mx-auto bg-gray-00 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">
                  Lista de Administradores
                </h2>
      
                {/* Mostrar error si existe */}
                {error && (
                  <p className="text-red-500 text-center mb-4 font-semibold">
                    {error}
                  </p>
                )}
      
                {/* Tabla para mostrar los administradores */}
                <div className="overflow-hidden bg-gray-800 shadow-lg rounded-lg">
                  <table className="min-w-full table-auto text-gray-300">
                    <thead>
                      <tr className="bg-grey-700">
                        <th className="py-3 px-6 text-sm font-semibold text-left">
                          Nombre
                        </th>
                        <th className="py-3 px-6 text-sm font-semibold text-left">
                          PIN
                        </th>
                        <th className="py-3 px-6 text-sm font-semibold text-left">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {administradores.length > 0 ? (
                        administradores.map((admin) => (
                          <tr
                            key={admin.id}
                            className="bg-gray-700 border-t border-gray-500 hover:bg-gray-800"
                          >
                            <td className="py-2 px-6 text-sm">{admin.nombre}</td>
                            <td className="py-2 px-6 text-sm">{admin.pin}</td>
                            <td className="py-2 px-6 text-sm flex space-x-4">
                              <button
                                onClick={() => handleEdit(admin)}
                                className="bg-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(admin.id)}
                                className="bg-red-900 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-2 px-6 text-center text-gray-500"
                          >
                            No hay administradores registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
      
              {/* Modal de edición */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
                  <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-100 mb-6">
                      Editar Administrador
                    </h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-gray-300">Nombre</label>
                        <input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300">PIN</label>
                        <input
                          type="text"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                        >
                          Guardar
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
            </div>
          </div>
        </Layout>
      );
    }  
    
    export default ListaAdministradores;
    
    
