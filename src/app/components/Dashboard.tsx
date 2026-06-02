import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Loader2,
} from "lucide-react";

import {
  obtenerPresupuesto,
  obtenerBalanceMensual,
  obtenerAlertaPresupuesto,
  obtenerRecomendaciones,
  type Presupuesto,
  type BalanceMensual,
  type AlertaPresupuesto,
  type Recomendacion,
} from "../services/apiService";

export function Dashboard() {

  const [presupuesto,setPresupuesto] =
    useState<Presupuesto | null>(null);

  const [balance,setBalance] =
    useState<BalanceMensual | null>(null);

  const [alerta,setAlerta] =
    useState<AlertaPresupuesto | null>(null);

  const [recomendaciones,setRecomendaciones] =
    useState<Recomendacion | null>(null);

  const [loading,setLoading] = useState(true);

  const [error,setError] = useState("");

  useEffect(() => {

    async function cargar() {

      try {

        setLoading(true);

        const [
          presupuestoData,
          balanceData,
          alertaData,
          recomendacionesData
        ] = await Promise.all([

          obtenerPresupuesto(),
          obtenerBalanceMensual(),
          obtenerAlertaPresupuesto(),
          obtenerRecomendaciones()

        ]);

        setPresupuesto(presupuestoData);
        setBalance(balanceData);
        setAlerta(alertaData);
        setRecomendaciones(recomendacionesData);

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Error cargando dashboard"
        );

      } finally {

        setLoading(false);

      }
    }

    cargar();

  }, []);

  if (loading) {

    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500"/>
      </div>
    );
  }

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold">
        Dashboard Financiero
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex justify-between">
            <p className="text-gray-500">Presupuesto</p>
            <Wallet className="text-blue-500"/>
          </div>

          <h3 className="text-3xl font-bold text-blue-600 mt-3">
            $
            {presupuesto.presupuestoInicial.toLocaleString() ?? 0}
          </h3>

        </div>

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex justify-between">
            <p className="text-gray-500">Ingresos</p>
            <TrendingUp className="text-green-600"/>
          </div>

          <h3 className="text-3xl font-bold text-green-600 mt-3">
            $
            {balance?.totalIngresos.toLocaleString() ?? 0}
          </h3>

        </div>

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex justify-between">
            <p className="text-gray-500">Gastos</p>
            <TrendingDown className="text-red-600"/>
          </div>

          <h3 className="text-3xl font-bold text-red-600 mt-3">
            $
            {balance?.totalGastos.toLocaleString() ?? 0}
          </h3>

        </div>

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex justify-between">
            <p className="text-gray-500">Saldo Actual</p>
            <Wallet className="text-purple-600"/>
          </div>

          <h3 className="text-3xl font-bold text-purple-600 mt-3">
            $
            {balance?.saldoActual.toLocaleString() ?? 0}
          </h3>

        </div>

      </div>

      {alerta && (

        <div
          className={`rounded-lg p-5 border ${
            alerta.alertaActiva
              ? "bg-red-50 border-red-300"
              : "bg-green-50 border-green-300"
          }`}
        >

          <div className="flex items-center gap-3">

            <AlertTriangle
              className={
                alerta.alertaActiva
                  ? "text-red-600"
                  : "text-green-600"
              }
            />

            <div>

              <h3 className="font-bold">
                Estado Presupuestal
              </h3>

              <p>
                {alerta.mensaje}
              </p>

              <p className="text-sm text-gray-600 mt-1">

                Gastado:
                {" "}
                {alerta.porcentajeGastado.toFixed(2)}
                %

              </p>

            </div>

          </div>

        </div>

      )}

      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center gap-3 mb-4">

          <Lightbulb className="text-yellow-500"/>

          <h3 className="text-xl font-semibold">
            Recomendaciones Financieras
          </h3>

        </div>

        {recomendaciones?.recomendaciones.length ? (

          <ul className="space-y-3">

            {recomendaciones.recomendaciones.map(
              (r,index) => (

                <li
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  {r}
                </li>

              )
            )}

          </ul>

        ) : (

          <p>
            No hay recomendaciones disponibles.
          </p>

        )}

      </div>

    </div>
  );
}
