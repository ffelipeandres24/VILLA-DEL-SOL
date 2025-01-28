import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import DashboardCard from '../components/dashboardcard';

export default function Home() {
  const [stats, setStats] = useState({
    totalPropietarios: 0,
    totalApartamentos: 0,
    visitantesHoy: 0,
    pagosPendientes: 0
  });

  useEffect(() => {
    // Aquí conectarías con tu API REST
    const fetchStats = async () => {
      try {
        // Ejemplo de llamada a tu API
        // const response = await fetch('http://tu-api/stats');
        // const data = await response.json();
        // setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Villa del Sol - Panel de Administración</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard 
            title="Total Propietarios"
            value={stats.totalPropietarios}
            icon="users"
          />
          <DashboardCard 
            title="Total Apartamentos"
            value={stats.totalApartamentos}
            icon="home"
          />
          <DashboardCard 
            title="Visitantes Hoy"
            value={stats.visitantesHoy}
            icon="userPlus"
          />
          <DashboardCard 
            title="Pagos Pendientes"
            value={stats.pagosPendientes}
            icon="dollarSign"
          />
        </div>
      </div>
    </Layout>
  );
}