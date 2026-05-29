import { useEffect, useState } from "react";
import { Wallet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  obtenerPresupuesto,
  inicializarPresupuesto,
  type Presupuesto,
} from "../services/apiService";

export function Budgets() {
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const p = await obtenerPresupuesto();
      setPresupuesto(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar presupuesto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleInicializar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = parseFloat(valor);
    if (isNaN(v) || v <= 0) {
      setError("El monto debe ser un número mayor a 0");
      return;
    }

    setSubmitting(true);
    try {
      const nuevo = await inicializarPresupuesto(v);
      setPresupuesto(nuevo);
      setValor("");
      setSuccess(`Presupuesto inicializado en $${nuevo.total.toLocaleString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al inicializar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Presupuesto</h2>
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

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-500">Saldo actual</p>
        {loading ? (
          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando...
          </div>
        ) : presupuesto ? (
          <p className="text-4xl font-bold text-blue-600 mt-2">
            ${presupuesto.total.toLocaleString()}
          </p>
        ) : (
          <p className="text-gray-500 mt-2">
            Aún no hay presupuesto. Inicialízalo abajo.
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {presupuesto ? "Reinicializar presupuesto" : "Inicializar presupuesto"}
        </h3>

        <form onSubmit={handleInicializar} className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monto inicial"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={submitting}
            className="flex-1 px-3 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Guardando..." : presupuesto ? "Reinicializar" : "Inicializar"}
          </button>
        </form>

        {presupuesto && (
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Reinicializar reemplazará el saldo actual.
          </p>
        )}
      </div>
    </div>
  );
}
