'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader } from 'lucide-react'; // para los iconos
import Layout from '../../components/layout';

const PagoPage = () => {
  const [pagos, setPagos] = useState([]);
  const [propietarioId, setPropietarioId] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [concepto, setConcepto] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // Para controlar el efecto de carga
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPago, setEditPago] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchPagos = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('No se encontró el token de autenticación.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/pagos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pagosData = response.data.data;
        if (Array.isArray(pagosData)) {
          setPagos(pagosData);
        } else {
          setError('Error al procesar los datos del servidor.');
        }
      } catch (error) {
        setError('No se pudieron obtener los pagos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true); // Mostrar efecto de carga
    try {
      const token = getToken();
      if (!token) {
        alert('No se encontró un token de autenticación. Por favor, inicia sesión.');
        return;
      }

      const data = {
        propietario_id: propietarioId,
        monto,
        fecha_pago: fechaPago,
        concepto,
        estado,
      };

      const response = await axios.post('http://localhost:4000/api/pagos', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPagos((prevPagos) => [...prevPagos, response.data.data]);
      setPropietarioId('');
      setMonto('');
      setFechaPago('');
      setConcepto('');
      setEstado('pendiente');
      setIsModalOpen(false);
      alert('Pago registrado con éxito');
    } catch (error) {
      alert('Error al registrar pago. Verifica la consola para más detalles.');
    } finally {
      setProcessing(false); // Ocultar efecto de carga
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true); // Mostrar efecto de carga
    try {
      const token = getToken();
      if (!token) {
        alert('No se encontró un token de autenticación. Por favor, inicia sesión.');
        return;
      }

      const data = {
        propietario_id: propietarioId,
        monto,
        fecha_pago: fechaPago,
        concepto,
        estado,
      };

      const response = await axios.put(`http://localhost:4000/api/pagos/${editPago.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPagos(pagos.map((pago) => (pago.id === editPago.id ? response.data.data : pago)));
      setIsModalOpen(false);
      alert('Pago actualizado con éxito');
    } catch (error) {
      alert('Error al actualizar el pago. Intenta nuevamente.');
    } finally {
      setProcessing(false); // Ocultar efecto de carga
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditPago(null);
  };

  const handleEdit = (pago) => {
    setEditPago(pago);
    setPropietarioId(pago.propietario_id);
    setMonto(pago.monto);
    setFechaPago(pago.fecha_pago);
    setConcepto(pago.concepto);
    setEstado(pago.estado);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este pago?');
    if (confirmDelete) {
      try {
        const token = getToken();
        if (!token) {
          alert('No se encontró un token de autenticación. Por favor, inicia sesión.');
          return;
        }

        await axios.delete(`http://localhost:4000/api/pagos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPagos(pagos.filter((pago) => pago.id !== id));
        alert('Pago eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar el pago. Intenta nuevamente.');
      }
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
      {/* Fondo personalizable */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://estaticos.elcolombiano.com/binrepository/580x365/0c0/1200d627/none/11101/JNHU/impuestos-renta-empresas-reforma-tri_45615663_20240718115616.jpg")',
        }}
      >
        <div className="bg-black bg-opacity-70 min-h-screen p-6">
          {/* Título  */}
          <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-6 tracking-wide font-sans">
            Gestionar Pagos
          </h1>

          {/* Botón de Registrar */}
          <div className="flex justify-center mb-6">
            <button
              onClick={openModal}
              className="flex items-center bg-green-900 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Nuevo Pago</span>
            </button>
          </div>

          {/* Modal registro */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {editPago ? 'Actualizar Pago' : 'Registrar Pago'}
                </h2>
                <form onSubmit={editPago ? handleUpdate : handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300">ID del Propietario</label>
                    <input
                      type="number"
                      value={propietarioId}
                      onChange={(e) => setPropietarioId(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ID del propietario"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Monto</label>
                    <input
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Monto"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Fecha de Pago</label>
                    <input
                      type="date"
                      value={fechaPago}
                      onChange={(e) => setFechaPago(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Concepto</label>
                    <input
                      type="text"
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Concepto"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Estado</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="vencido">Vencido</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                  <button
                    type="submit"
                    className={`py-2 px-6 rounded-lg shadow-lg text-white font-medium flex items-center justify-center space-x-2 transition-all transform ${
                      processing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                    }`}
                    disabled={processing} // Deshabilitar mientras carga
                  >
                    {processing ? (
                      <div className="flex items-center space-x-2">
                        {/* Spinner */}
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 border-gray-300 animate-spin"></div>
                        </div>
                        <span className="text-white">Procesando...</span>
                      </div>
                    ) : (
                      <span>{editPago ? "Actualizar" : "Registrar"}</span>
                    )}
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

          {/* Tabla de Pagos */}
          <h2 className="text-3xl font-bold text-center text-gray-100 mt-7 mb-4">Lista de Pagos</h2>
          {loading ? (
            <div className="text-center text-lg text-white">Cargando pagos...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-hidden bg-gray-800 bg-opacity-80 shadow-lg rounded-lg mt-6">
              <table className="min-w-full table-auto text-gray-300">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-6 text-sm font-semibold text-left">ID Propietario</th>
                    <th className="py-3 px-6 text-sm font-semibold text-left">Monto</th>
                    <th className="py-3 px-6 text-sm font-semibold text-left">Fecha</th>
                    <th className="py-3 px-6 text-sm font-semibold text-left">Concepto</th>
                    <th className="py-3 px-6 text-sm font-semibold text-left">Estado</th>
                    <th className="py-3 px-6 text-sm font-semibold text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-sm text-left">{pago.propietario_id}</td>
                      <td className="py-3 px-6 text-sm text-left">{pago.monto}</td>
                      <td className="py-3 px-6 text-sm text-left">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-sm text-left">{pago.concepto}</td>
                      <td className="py-3 px-6 text-sm text-left">{pago.estado}</td>
                      <td className="py-3 px-6 text-sm text-left">
                        <button
                          onClick={() => handleEdit(pago)}
                          className="bg-green-900 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(pago.id)}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PagoPage;


