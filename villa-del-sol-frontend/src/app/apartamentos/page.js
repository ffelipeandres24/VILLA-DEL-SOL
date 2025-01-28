

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/layout';
import { Plus, Loader } from 'lucide-react';

const Spinner = () => (
  <div className="w-12 h-12 border-4 border-dashed rounded-full border-indigo-600 animate-spin"></div>
);

export default function Apartamentos() {
  const [apartamentos, setApartamentos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numero, setNumero] = useState('');
  const [bloque, setBloque] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');
  const [propietarioId, setPropietarioId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apartamentoToEdit, setApartamentoToEdit] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se proporcionó token de autorización.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [apartamentosResponse, propietariosResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/apartamentos', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:4000/api/propietarios', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (
          apartamentosResponse.data?.data &&
          Array.isArray(apartamentosResponse.data.data)
        ) {
          setApartamentos(apartamentosResponse.data.data);
        } else {
          setError('Error al cargar los datos de apartamentos.');
        }

        if (
          propietariosResponse.data?.data &&
          Array.isArray(propietariosResponse.data.data)
        ) {
          setPropietarios(propietariosResponse.data.data);
        } else {
          setError('Error al cargar los datos de propietarios.');
        }
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('Hubo un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const nuevoApartamento = {
      numero,
      bloque,
      metros_cuadrados: metrosCuadrados,
      propietario_id: propietarioId,
    };

    try {
      const response = await axios.post(
        'http://localhost:4000/api/apartamentos',
        nuevoApartamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.data) {
        setApartamentos([...apartamentos, response.data.data]);
        setIsModalOpen(false);
      } else {
        setError('No se pudo registrar el nuevo apartamento.');
      }
    } catch (err) {
      console.error('Error al registrar apartamento:', err);
      setError('Hubo un error al registrar el apartamento.');
    }
  };

  const handleEdit = (apartamento) => {
    setApartamentoToEdit(apartamento);
    setNumero(apartamento.numero);
    setBloque(apartamento.bloque);
    setMetrosCuadrados(apartamento.metros_cuadrados);
    setPropietarioId(apartamento.propietario_id);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedApartamento = {
      numero,
      bloque,
      metros_cuadrados: metrosCuadrados,
      propietario_id: propietarioId,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/api/apartamentos/${apartamentoToEdit.id}`,
        updatedApartamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.data) {
        setApartamentos(
          apartamentos.map((apt) =>
            apt.id === apartamentoToEdit.id ? response.data.data : apt
          )
        );
        setIsModalOpen(false);
      } else {
        setError('No se pudo actualizar el apartamento.');
      }
    } catch (err) {
      console.error('Error al actualizar apartamento:', err);
      setError('Hubo un error al actualizar el apartamento.');
    }
  };
  const openModal = () => setIsModalOpen(true);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/apartamentos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.data) {
        setApartamentos(apartamentos.filter((apartamento) => apartamento.id !== id));
      } else {
        setError('No se pudo eliminar el apartamento.');
      }
    } catch (err) {
      console.error('Error al eliminar apartamento:', err);
      setError('Hubo un error al eliminar el apartamento.');
    }
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
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://estaticos.elcolombiano.com/binrepository/580x365/0c0/1200d627/none/11101/JNHU/impuestos-renta-empresas-reforma-tri_45615663_20240718115616.jpg")',
        }}
      >
        <div className="bg-black bg-opacity-70 min-h-screen p-6">
          <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-6 tracking-wide font-sans">
            Gestionar Apartamentos
          </h1>
          {/* Botón de Registrar */}
          <div className="flex justify-center mb-6">
            <button
              onClick={openModal}
              className="flex items-center bg-green-900 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Nuevo Apartamento</span>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-100 mt-7 mb-4">Lista de Apartamentos</h2>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {apartamentoToEdit ? 'Editar Apartamento' : 'Registrar Apartamento'}
                </h2>
                <form onSubmit={apartamentoToEdit ? handleUpdate : handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300">Número del Apartamento</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Bloque</label>
                    <input
                      type="text"
                      value={bloque}
                      onChange={(e) => setBloque(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Metros Cuadrados</label>
                    <input
                      type="number"
                      value={metrosCuadrados}
                      onChange={(e) => setMetrosCuadrados(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Propietario</label>
                    <select
                      value={propietarioId}
                      onChange={(e) => setPropietarioId(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Seleccione propietario</option>
                      {propietarios.map((propietario) => (
                        <option key={propietario.id} value={propietario.id}>
                          {propietario.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center space-x-2"
                    >
                      {apartamentoToEdit ? 'Actualizar' : 'Registrar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-hidden bg-gray-800 bg-opacity-80 shadow-lg rounded-lg mt-6">
            <table className="min-w-full table-auto text-gray-300">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-6 text-sm font-semibold text-left">ID</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Número</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Bloque</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Metros Cuadrados</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Propietario</th>
                  <th className="py-3 px-6 text-sm font-semibold text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apartamentos.map((apartamento) => (
                  <tr key={apartamento.id} className="border-b border-gray-600 hover:bg-gray-800">
                    <td className="py-3 px-6 text-sm">{apartamento.id}</td>
                    <td className="py-3 px-6 text-sm">{apartamento.numero}</td>
                    <td className="py-3 px-6 text-sm">{apartamento.bloque}</td>
                    <td className="py-3 px-6 text-sm">{apartamento.metros_cuadrados}</td>
                    <td className="py-3 px-6 text-sm">
                      {
                        propietarios.find(p => p.id === apartamento.propietario_id) 
                          ? propietarios.find(p => p.id === apartamento.propietario_id).nombre 
                          : 'N/A'
                      }
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <button
                        onClick={() => handleEdit(apartamento)}
                        className="bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(apartamento.id)}
                        className="ml-2 bg-red-900 text-white py-2 px-4 rounded-md hover:bg-red-600"
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
