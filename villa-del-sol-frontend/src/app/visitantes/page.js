
'use client'; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import { Plus, Loader } from 'lucide-react'; 

export default function Visitantes() {
  const [visitantes, setVisitantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apartamentoId, setApartamentoId] = useState('');
  const [documento, setDocumento] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [motivoVisita, setMotivoVisita] = useState('');
  const [estado, setEstado] = useState('activo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVisitante, setCurrentVisitante] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se proporcionó token de autorización.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:4000/api/visitantes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setVisitantes(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Hubo un error al cargar los visitantes.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir los datos a enviar
    const data = {
      nombre,
      apartamento_id: parseInt(apartamentoId, 10),
      documento,
      fecha_entrada: fechaIngreso,
      motivo_visita: motivoVisita,
    };

    // Agregar campos opcionales solo si están 
    if (fechaSalida) data.fecha_salida = fechaSalida;
    if (estado) data.estado = estado;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se proporcionó token de autorización.');
      return;
    }

    axios
      .post('http://localhost:4000/api/visitantes', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setVisitantes([...visitantes, response.data.data]);
        resetForm();
        setIsModalOpen(false);
      })
      .catch(() => {
        setError('Hubo un error al registrar el visitante.');
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se proporcionó token de autorización.');
      return;
    }

    axios
      .delete(`http://localhost:4000/api/visitantes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVisitantes(visitantes.filter((visitante) => visitante.id !== id));
      })
      .catch(() => {
        setError('Hubo un error al eliminar el visitante.');
      });
  };

  const handleUpdate = (visitante) => {
    setCurrentVisitante(visitante);
    setNombre(visitante.nombre);
    setApartamentoId(visitante.apartamento_id);
    setDocumento(visitante.documento);
    setFechaIngreso(visitante.fecha_entrada);
    setFechaSalida(visitante.fecha_salida || '');
    setMotivoVisita(visitante.motivo_visita);
    setEstado(visitante.estado);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNombre('');
    setApartamentoId('');
    setDocumento('');
    setFechaIngreso('');
    setFechaSalida('');
    setMotivoVisita('');
    setEstado('activo');
    setCurrentVisitante(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
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
      {/* Fondo */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://www.shutterstock.com/image-photo/close-agent-giving-key-new-260nw-2476457371.jpg")', 
        }}
      >
        <div className="bg-black bg-opacity-70 min-h-screen p-6">
          {/* Título */}
          <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-6 tracking-wide font-sans">
            Control de Visitantes
          </h1>
  
           {/* Botón de Registrar con Icono */}
           <div className="flex justify-center mb-6">
            <button
              onClick={openModal}
              className="flex items-center bg-green-900 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Nuevo Visitante</span>
            </button>
          </div>
  
          {/* Modal para Registrar o Editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {currentVisitante ? "Actualizar Visitante" : "Registrar Visitante"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300">Nombre del Visitante</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">ID Apartamento</label>
                    <input
                      type="number"
                      value={apartamentoId}
                      onChange={(e) => setApartamentoId(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Documento del Visitante</label>
                    <input
                      type="text"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Fecha de Ingreso</label>
                    <input
                      type="datetime-local"
                      value={fechaIngreso}
                      onChange={(e) => setFechaIngreso(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Fecha de Salida</label>
                    <input
                      type="datetime-local"
                      value={fechaSalida}
                      onChange={(e) => setFechaSalida(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Motivo de Visita</label>
                    <input
                      type="text"
                      value={motivoVisita}
                      onChange={(e) => setMotivoVisita(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Estado</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="activo">Activo</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 flex items-center space-x-2"
                    >
                      {currentVisitante ? "Actualizar" : "Registrar"}
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
  
          {/* Tabla de Visitantes */}
          <h2 className="text-3xl font-bold text-center text-gray-100 mt-7 mb-4">Lista de Visitantes</h2>
          <div className="overflow-hidden bg-gray-800 bg-opacity-80 shadow-lg rounded-lg mt-6">
            <table className="min-w-full table-auto text-gray-300">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-6 text-sm font-semibold text-left">ID</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Nombre</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">ID Apartamento</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Documento</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Fecha Ingreso</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Fecha Salida</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Motivo</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Estado</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visitantes.map((visitante) => (
                  <tr
                    key={visitante.id}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="py-3 px-6 text-sm">{visitante.id}</td>
                    <td className="py-3 px-6 text-sm">{visitante.nombre}</td>
                    <td className="py-3 px-6 text-sm">{visitante.apartamento_id}</td>
                    <td className="py-3 px-6 text-sm">{visitante.documento}</td>
                    <td className="py-3 px-6 text-sm">{visitante.fecha_entrada}</td>
                    <td className="py-3 px-6 text-sm">{visitante.fecha_salida}</td>
                    <td className="py-3 px-6 text-sm">{visitante.motivo_visita}</td>
                    <td className="py-3 px-6 text-sm">{visitante.estado}</td>
                    <td className="py-3 px-6 text-sm">
                      <button
                        onClick={() => handleUpdate(visitante)}
                        className="bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(visitante.id)}
                        className="bg-red-900 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105 ml-2"
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
         {/** Pie de página */}
         <footer className="bg-gray-800 text-gray-400 py-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Villa del Sol. Todos los derechos reservados.
            </p>
            <p className="mt-1">
              Desarrollado por <span className="text-yellow-400">Andres Rivera</span>.
            </p>
          </footer>
      </div>
    </Layout>
  );
}  
