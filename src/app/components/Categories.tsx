import { useEffect, useState } from "react";
import { Tag, Plus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  obtenerCategorias,
  crearCategoria,
  type Categoria,
  type TipoCategoria,
} from "../services/apiService";

export function Categories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoCategoria>("GASTO");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanNombre = nombre.trim();
    if (!cleanNombre) {
      setError("El nombre es obligatorio");
      return;
    }

    setSubmitting(true);
    try {
      const nueva = await crearCategoria(cleanNombre, tipo);
      setCategorias((prev) => [...prev, nueva]);
      setNombre("");
      setSuccess(`Categoría "${nueva.nombre}" creada`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoría");
    } finally {
      setSubmitting(false);
    }
  };

  const ingresos = categorias.filter((c) => c.tipo === "INGRESO");
  const gastos = categorias.filter((c) => c.tipo === "GASTO");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tag className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Categorías</h2>
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

      <form onSubmit={handleCrear} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva categoría
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nombre (ej: Salario, Comida)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={submitting}
            className="px-3 py-2 border rounded-lg sm:col-span-2"
            required
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCategoria)}
            disabled={submitting}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {submitting ? "Creando..." : "Crear categoría"}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Ingresos ({ingresos.length})
            </h3>
            {ingresos.length === 0 ? (
              <p className="text-sm text-gray-500">Sin categorías</p>
            ) : (
              <ul className="space-y-2">
                {ingresos.map((c) => (
                  <li
                    key={c.id}
                    className="flex justify-between items-center px-3 py-2 bg-green-50 rounded"
                  >
                    <span>{c.nombre}</span>
                    <span className="text-xs text-gray-500">#{c.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Gastos ({gastos.length})
            </h3>
            {gastos.length === 0 ? (
              <p className="text-sm text-gray-500">Sin categorías</p>
            ) : (
              <ul className="space-y-2">
                {gastos.map((c) => (
                  <li
                    key={c.id}
                    className="flex justify-between items-center px-3 py-2 bg-red-50 rounded"
                  >
                    <span>{c.nombre}</span>
                    <span className="text-xs text-gray-500">#{c.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
