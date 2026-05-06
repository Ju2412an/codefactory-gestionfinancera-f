import { useState, useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { Plus, Trash2, Edit2 } from "lucide-react";

export function Income() {
  const { income, addIncome, updateIncome, deleteIncome } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // ✅ fecha por defecto
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      alert("El monto debe ser un número válido mayor a 0");
      return;
    }

    const payload = {
      description: formData.description.trim(),
      amount,
      date: formData.date,
      category: formData.category.trim(),
    };

    if (editingId) {
      updateIncome(editingId, payload);
      setEditingId(null);
    } else {
      addIncome(payload);
    }

    // reset
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
    });

    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      description: item.description,
      amount: item.amount.toString(),
      date: item.date,
      category: item.category,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalIncome = useMemo(
    () => income.reduce((sum, i) => sum + i.amount, 0),
    [income]
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ingresos</h2>
          <p className="text-lg text-green-600 mt-1">
            Total: ${totalIncome.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Ingreso
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Editar Ingreso" : "Agregar Ingreso"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Monto"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Categoría (Ej: Salario, Freelance, Inversiones)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                {editingId ? "Actualizar" : "Guardar"}
              </button>

              <button type="button" onClick={handleCancel} className="flex-1 bg-gray-200 py-2 rounded-lg">
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {income.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No hay ingresos registrados
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Monto</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {income.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.description}</td>

                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(item.date).toLocaleDateString("es-ES")}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    ${item.amount.toLocaleString()}
                  </td>

                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(item)} className="mr-2 text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button onClick={() => deleteIncome(item.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
