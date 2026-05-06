import { useEffect, useState } from "react";
import { obtenerMovimientos, type Movimiento } from "../services/apiService";

export function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    obtenerMovimientos().then(setMovimientos);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Movimientos</h2>

      <ul>
        {movimientos.map(m => (
          <li key={m.id}>
            {m.tipo === "GASTO" ? "🔴" : "🟢"} ${m.monto} - {m.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}