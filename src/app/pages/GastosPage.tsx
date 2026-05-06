import { useEffect, useState } from "react";
import {
  obtenerMovimientos,
  crearMovimiento,
  obtenerCategorias,
  type Movimiento,
  type Categoria
} from "../services/apiService";

export function GastosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [monto, setMonto] = useState(0);
  const [categoriaId, setCategoriaId] = useState(0);
  const [descripcion, setDescripcion] = useState("");

  const cargar = async () => {
    setMovimientos(await obtenerMovimientos());
    setCategorias(await obtenerCategorias());
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async () => {
    await crearMovimiento({
      tipo: "GASTO",
      monto,
      categoriaId,
      descripcion,
      fecha: new Date().toISOString()
    });
    cargar();
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Gastos</h2>

      <div className="flex gap-2 mb-4">
        <input type="number" onChange={(e) => setMonto(Number(e.target.value))} placeholder="Monto" />
        <select onChange={(e) => setCategoriaId(Number(e.target.value))}>
          <option>Seleccionar</option>
          {categorias.filter(c => c.tipo === "GASTO").map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <input onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
        <button onClick={crear}>Agregar</button>
      </div>

      <ul>
        {movimientos
          .filter(m => m.tipo === "GASTO")
          .map(m => (
            <li key={m.id}>-${m.monto} ({m.descripcion})</li>
          ))}
      </ul>
    </div>
  );
}