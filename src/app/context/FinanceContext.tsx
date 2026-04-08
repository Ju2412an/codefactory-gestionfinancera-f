import React, { createContext, useContext, useState, ReactNode } from "react";

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
  date: string;
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface FinanceContextType {
  budgets: Budget[];
  income: Income[];
  expenses: Expense[];
  addBudget: (budget: Omit<Budget, "id" | "spent">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addIncome: (income: Omit<Income, "id">) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", category: "Alimentación", amount: 500, spent: 320, period: "monthly" },
    { id: "2", category: "Transporte", amount: 200, spent: 150, period: "monthly" },
    { id: "3", category: "Entretenimiento", amount: 150, spent: 80, period: "monthly" },
  ]);

  const [income, setIncome] = useState<Income[]>([
    { id: "1", description: "Salario", amount: 3000, date: "2026-04-01", category: "Salario" },
    { id: "2", description: "Freelance", amount: 500, date: "2026-04-05", category: "Trabajo Extra" },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", description: "Supermercado", amount: 120, date: "2026-04-02", category: "Alimentación" },
    { id: "2", description: "Gasolina", amount: 60, date: "2026-04-03", category: "Transporte" },
    { id: "3", description: "Restaurante", amount: 45, date: "2026-04-04", category: "Alimentación" },
    { id: "4", description: "Cine", amount: 30, date: "2026-04-06", category: "Entretenimiento" },
  ]);

  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets(budgets.map((b) => (b.id === id ? { ...b, ...updatedBudget } : b)));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const income: Income = {
      ...newIncome,
      id: Date.now().toString(),
    };
    setIncome((prev) => [...prev, income]);
  };

  const updateIncome = (id: string, updatedIncome: Partial<Income>) => {
    setIncome((prev) => prev.map((i) => (i.id === id ? { ...i, ...updatedIncome } : i)));
  };

  const deleteIncome = (id: string) => {
    setIncome((prev) => prev.filter((i) => i.id !== id));
  };

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    };
    setExpenses((prev) => [...prev, expense]);
    
    // Update budget spent
    const budget = budgets.find((b) => b.category === newExpense.category);
    if (budget) {
      updateBudget(budget.id, { spent: budget.spent + newExpense.amount });
    }
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e)));
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      const budget = budgets.find((b) => b.category === expense.category);
      if (budget) {
        updateBudget(budget.id, { spent: Math.max(0, budget.spent - expense.amount) });
      }
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        budgets,
        income,
        expenses,
        addBudget,
        updateBudget,
        deleteBudget,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
