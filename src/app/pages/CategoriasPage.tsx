import { useEffect, useState } from "react";
import { obtenerCategorias, crearCategoria, type Categoria } from "../services/apiService";

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<'INGRESO' | 'GASTO'>("GASTO");

  const cargar = async () => {
    const data = await obtenerCategorias();
    setCategorias(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async () => {
    await crearCategoria({ nombre, tipo });
    setNombre("");
    cargar();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Categorías</h2>

      <div className="flex gap-2 mb-4">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
        <select onChange={(e) => setTipo(e.target.value as any)}>
          <option value="GASTO">Gasto</option>
          <option value="INGRESO">Ingreso</option>
        </select>
        <button onClick={handleCrear}>Crear</button>
      </div>

      <ul>
        {categorias.map(c => (
          <li key={c.id}>{c.nombre} ({c.tipo})</li>
        ))}
      </ul>
    </div>
  );
}