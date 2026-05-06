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
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // -------------------- BUDGET --------------------
  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      spent: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBudget } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // -------------------- INCOME --------------------
  const addIncome = (newIncome: Omit<Income, "id">) => {
    const incomeItem: Income = {
      ...newIncome,
      id: crypto.randomUUID(),
    };
    setIncome((prev) => [...prev, incomeItem]);
  };

  const updateIncome = (id: string, updatedIncome: Partial<Income>) => {
    setIncome((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updatedIncome } : i))
    );
  };

  const deleteIncome = (id: string) => {
    setIncome((prev) => prev.filter((i) => i.id !== id));
  };

  // -------------------- EXPENSE --------------------
  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expenseItem: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };

    setExpenses((prev) => [...prev, expenseItem]);

    // 🔥 actualizar presupuesto correctamente (sin usar estado viejo)
    setBudgets((prev) =>
      prev.map((b) =>
        b.category === newExpense.category
          ? { ...b, spent: b.spent + newExpense.amount }
          : b
      )
    );
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prevExpenses) => {
      const expense = prevExpenses.find((e) => e.id === id);

      if (expense) {
        setBudgets((prevBudgets) =>
          prevBudgets.map((b) =>
            b.category === expense.category
              ? { ...b, spent: Math.max(0, b.spent - expense.amount) }
              : b
          )
        );
      }

      return prevExpenses.filter((e) => e.id !== id);
    });
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
