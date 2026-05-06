import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  obtenerUsuarioLocal, 
  limpiarAutenticacion, 
  type Usuario 
} from "../services/apiService";

import { 
  LogOut, 
  User, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle 
} from "lucide-react";

export function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = obtenerUsuarioLocal();

    if (!user) {
      navigate("/login");
    } else {
      setUsuario(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    limpiarAutenticacion();
    navigate("/login");
  };

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-[#f4f6f9]">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#2c3e50]">
          FinanzApp
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            {usuario.nombre}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="p-6 space-y-6">

        {/* BIENVENIDA */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Hola, {usuario.nombre} 👋
          </h2>
          <p className="text-gray-500">
            Aquí tienes un resumen de tu actividad financiera
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Presupuesto */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-500">Presupuesto</h3>
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">$0</p>
            <p className="text-xs text-gray-400">Aún no conectado</p>
          </div>

          {/* Ingresos */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-500">Ingresos</h3>
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">$0</p>
            <p className="text-xs text-gray-400">Próximamente</p>
          </div>

          {/* Gastos */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-500">Gastos</h3>
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">$0</p>
            <p className="text-xs text-gray-400">Próximamente</p>
          </div>

        </div>

        {/* ACCIONES */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Acciones rápidas
          </h3>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/gastos")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Registrar gasto
            </button>

            <button
              onClick={() => navigate("/ingresos")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Registrar ingreso
            </button>

            <button
              onClick={() => navigate("/usuarios")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Ver usuarios
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}