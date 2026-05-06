import { Navigate, Outlet } from "react-router-dom";
import { estaAutenticado } from "../services/apiService";

export function ProtectedRoute() {
  const isAuth = estaAutenticado();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
