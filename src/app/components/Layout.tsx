import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Wallet, TrendingUp, TrendingDown } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Finanzas</h1>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Panel</span>
            </NavLink>

            <NavLink
              to="/budgets"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`
              }
            >
              <Wallet className="w-5 h-5" />
              <span>Presupuestos</span>
            </NavLink>

            <NavLink
              to="/income"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`
              }
            >
              <TrendingUp className="w-5 h-5" />
              <span>Ingresos</span>
            </NavLink>

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`
              }
            >
              <TrendingDown className="w-5 h-5" />
              <span>Gastos</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
