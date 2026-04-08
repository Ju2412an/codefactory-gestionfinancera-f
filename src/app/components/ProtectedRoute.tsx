import { Navigate, Outlet } from "react-router";
import { estaAutenticado } from "../services/apiService";

export function ProtectedRoute() {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
