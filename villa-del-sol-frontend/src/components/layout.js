import Navbar from './navbar';
import Sidebar from './sidebar';
import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}