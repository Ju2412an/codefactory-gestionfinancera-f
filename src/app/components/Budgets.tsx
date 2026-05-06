import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { Plus, Trash2, Edit2 } from "lucide-react";

type Budget = {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  period: "monthly" | "yearly";
};

export function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly" as "monthly" | "yearly",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      setError("El monto debe ser un número válido mayor a 0");
      return;
    }

    try {
      if (editingId) {
        updateBudget(editingId, {
          category: formData.category,
          amount,
          period: formData.period,
        });
      } else {
        addBudget({
          category: formData.category,
          amount,
          period: formData.period,
        });
      }

      resetForm();
    } catch (err) {
      setError("Error al guardar el presupuesto");
    }
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormData({ category: "", amount: "", period: "monthly" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Presupuestos</h2>
        <button
          onClick={() => {
            if (editingId) {
              handleCancel();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {editingId ? "Cancelar edición" : "Nuevo Presupuesto"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Editar Presupuesto" : "Agregar Presupuesto"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Categoría"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="number"
              step="0.01"
              placeholder="Monto"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  period: e.target.value as "monthly" | "yearly",
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget: Budget) => {
          const spent = budget.spent || 0;
          const percentage = (spent / budget.amount) * 100;
          const isOverBudget = percentage > 100;

          return (
            <div key={budget.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{budget.category}</h3>
                  <p className="text-sm text-gray-500">
                    {budget.period === "monthly" ? "Mensual" : "Anual"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(budget)}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBudget(budget.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="text-sm mb-2">
                ${spent.toLocaleString()} / ${budget.amount.toLocaleString()}
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    isOverBudget
                      ? "bg-red-600"
                      : percentage > 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
