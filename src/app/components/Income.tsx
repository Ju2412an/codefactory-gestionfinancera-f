import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  obtenerCategorias,
  obtenerPresupuesto,
  registrarIngreso,
  listarMovimientos,
  type Categoria,
  type Presupuesto,
  type Movimiento,
} from "../services/apiService";

export function Income() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, p, movs] = await Promise.all([
        obtenerCategorias(),
        obtenerPresupuesto(),
        listarMovimientos(),
      ]);
      setCategorias(cats);
      setPresupuesto(p);
      setMovimientos(movs.filter((m) => m.tipo === "INGRESO"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = parseFloat(valor);
    if (isNaN(v) || v <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    if (!categoriaId) {
      setError("Debes seleccionar una categoría");
      return;
    }

    setSubmitting(true);
    try {
      const nuevo = await registrarIngreso({
        valor: v,
        categoriaId: Number(categoriaId),
        descripcion: descripcion.trim() || undefined,
      });
      setPresupuesto(nuevo);
      setSuccess(`Ingreso de $${v.toLocaleString()} registrado. Nuevo saldo: $${nuevo.total.toLocaleString()}`);
      setValor("");
      setCategoriaId("");
      setDescripcion("");
      const movs = await listarMovimientos();
      setMovimientos(movs.filter((m) => m.tipo === "INGRESO"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar ingreso");
    } finally {
      setSubmitting(false);
    }
  };

  const categoriasIngreso = categorias.filter((c) => c.tipo === "INGRESO");
  const total = movimientos.reduce((s, m) => s + m.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold">Ingresos</h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Saldo presupuesto</p>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400 mt-2" />
          ) : presupuesto ? (
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${presupuesto.total.toLocaleString()}
            </p>
          ) : (
            <p className="text-yellow-600 mt-2 text-sm">
              ⚠️ Inicializa tu presupuesto antes de registrar ingresos.
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total ingresos registrados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${total.toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold">Nuevo ingreso</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              disabled={submitting || !presupuesto}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : "")}
              disabled={submitting || !presupuesto || categoriasIngreso.length === 0}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">
                {categoriasIngreso.length === 0
                  ? "No hay categorías de ingreso"
                  : "Selecciona categoría"}
              </option>
              {categoriasIngreso.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
          <input
            type="text"
            placeholder="Ej: Sueldo octubre"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={submitting || !presupuesto}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !presupuesto || categoriasIngreso.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {submitting ? "Registrando..." : "Registrar ingreso"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Histórico de ingresos ({movimientos.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : movimientos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin ingresos registrados</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-600">
                    {new Date(m.fecha).toLocaleString("es-ES")}
                  </td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {m.categoriaNombre || "—"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{m.descripcion || "—"}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">
                    +${m.valor.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
