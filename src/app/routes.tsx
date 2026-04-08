import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./components/Dashboard";
import { Budgets } from "./components/Budgets";
import { Income } from "./components/Income";
import { Expenses } from "./components/Expenses";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UsersPage } from "./pages/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "users", Component: UsersPage },
          { path: "budgets", Component: Budgets },
          { path: "income", Component: Income },
          { path: "expenses", Component: Expenses },
        ],
      },
    ],
  },
]);
