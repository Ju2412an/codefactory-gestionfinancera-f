export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "monthly" | "yearly";
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
}

// Presupuestos mock
export const mockBudgets: Budget[] = [
  {
    id: "1",
    category: "Alimentación",
    amount: 500,
    spent: 320,
    period: "monthly",
  },
  {
    id: "2",
    category: "Transporte",
    amount: 200,
    spent: 150,
    period: "monthly",
  },
  {
    id: "3",
    category: "Entretenimiento",
    amount: 150,
    spent: 80,
    period: "monthly",
  },
  {
    id: "4",
    category: "Salud",
    amount: 100,
    spent: 40,
    period: "monthly",
  },
];

// Ingresos mock
export const mockIncome: Income[] = [
  {
    id: "1",
    description: "Salario",
    amount: 3000,
    date: "2026-04-01",
    category: "Salario",
  },
  {
    id: "2",
    description: "Freelance diseño",
    amount: 500,
    date: "2026-04-05",
    category: "Freelance",
  },
  {
    id: "3",
    description: "Venta de producto",
    amount: 250,
    date: "2026-04-10",
    category: "Ventas",
  },
];

// Gastos mock
export const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Supermercado",
    amount: 120,
    date: "2026-04-02",
    category: "Alimentación",
  },
  {
    id: "2",
    description: "Gasolina",
    amount: 60,
    date: "2026-04-03",
    category: "Transporte",
  },
  {
    id: "3",
    description: "Restaurante",
    amount: 45,
    date: "2026-04-04",
    category: "Alimentación",
  },
  {
    id: "4",
    description: "Cine",
    amount: 30,
    date: "2026-04-06",
    category: "Entretenimiento",
  },
  {
    id: "5",
    description: "Medicamentos",
    amount: 40,
    date: "2026-04-08",
    category: "Salud",
  },
];

// Helpers útiles (opcional pero recomendable)
export const getTotalIncome = () =>
  mockIncome.reduce((sum, i) => sum + i.amount, 0);

export const getTotalExpenses = () =>
  mockExpenses.reduce((sum, e) => sum + e.amount, 0);

export const getBalance = () =>
  getTotalIncome() - getTotalExpenses();
