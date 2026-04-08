import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Budgets } from "./components/Budgets";
import { Income } from "./components/Income";
import { Expenses } from "./components/Expenses";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "budgets", Component: Budgets },
      { path: "income", Component: Income },
      { path: "expenses", Component: Expenses },
    ],
  },
]);
