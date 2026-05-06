import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

export function Dashboard() {
  const { budgets, income, expenses } = useFinance();

  // ✅ Totales optimizados
  const totalIncome = useMemo(
    () => income.reduce((sum, i) => sum + i.amount, 0),
    [income]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + b.amount, 0),
    [budgets]
  );

  const balance = totalIncome - totalExpenses;

  // ✅ Pie data
  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};

    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  // ✅ Budget data
  const budgetData = useMemo(() => {
    return budgets.map((b) => ({
      category: b.category,
      presupuesto: b.amount,
      gastado: b.spent,
    }));
  }, [budgets]);

  // ✅ Actividad reciente (CORREGIDO)
  const recentActivity = useMemo(() => {
    const merged = [
      ...income.map((i) => ({ ...i, type: "income" })),
      ...expenses.map((e) => ({ ...e, type: "expense" })),
    ];

    return merged
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [income, expenses]);

  return (
    <div className="space-y-6">

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Ingresos Totales</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Gastos Totales</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Balance</p>
          <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
            ${balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Presupuesto Total</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Estado de Presupuestos</h2>

          {budgetData.length === 0 ? (
            <p className="text-gray-500 text-center">No hay presupuestos</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="presupuesto" fill="#3b82f6" />
                <Bar dataKey="gastado" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* Pie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Gastos por Categoría</h2>

          {pieData.length === 0 ? (
            <p className="text-gray-500 text-center">No hay gastos</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>

      </div>

      {/* Actividad */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>

        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center">Sin movimientos</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${
                    item.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.type === "income" ? "+" : "-"}${item.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
