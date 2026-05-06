import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Wallet,
  Tag,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  obtenerPresupuesto,
  obtenerCategorias,
  listarMovimientos,
  type Presupuesto,
  type Categoria,
  type Movimiento,
} from "../services/apiService";

export function Dashboard() {
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [p, cats, movs] = await Promise.all([
          obtenerPresupuesto(),
          obtenerCategorias(),
          listarMovimientos(),
        ]);
        setPresupuesto(p);
        setCategorias(cats);
        setMovimientos(movs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalIngresos = useMemo(
    () => movimientos.filter((m) => m.tipo === "INGRESO").reduce((s, m) => s + m.valor, 0),
    [movimientos],
  );
  const totalGastos = useMemo(
    () => movimientos.filter((m) => m.tipo === "GASTO").reduce((s, m) => s + m.valor, 0),
    [movimientos],
  );
  const ultimos = movimientos.slice(0, 5);
  const cats = categorias.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Panel</h2>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Saldo presupuesto</p>
            <Wallet className="w-5 h-5 text-blue-500" />
          </div>
          {presupuesto ? (
            <p className="text-3xl font-bold text-blue-600">
              ${presupuesto.total.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm text-yellow-600 mt-2">
              Sin inicializar — ve a{" "}
              <Link to="/budgets" className="underline">Presupuesto</Link>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total ingresos</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalIngresos.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total gastos</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            ${totalGastos.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Categorías</p>
            <Tag className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{cats}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/income" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Registrar ingreso
          </Link>
          <Link to="/expenses" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Registrar gasto
          </Link>
          <Link to="/categories" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <Tag className="w-4 h-4" /> Gestionar categorías
          </Link>
          <Link to="/budgets" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Presupuesto
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Últimos movimientos</h3>
        </div>
        {ultimos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin movimientos aún</p>
        ) : (
          <ul className="divide-y">
            {ultimos.map((m) => (
              <li key={m.id} className="p-4 flex justify-between">
                <div>
                  <p className="font-medium">
                    {m.tipo === "INGRESO" ? "🟢" : "🔴"} {m.descripcion || m.categoriaNombre || "Movimiento"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {m.categoriaNombre} · {new Date(m.fecha).toLocaleString("es-ES")}
                  </p>
                </div>
                <p className={`font-semibold ${m.tipo === "INGRESO" ? "text-green-600" : "text-red-600"}`}>
                  {m.tipo === "INGRESO" ? "+" : "-"}${m.valor.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
