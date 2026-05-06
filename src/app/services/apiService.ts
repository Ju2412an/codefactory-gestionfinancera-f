// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// =========================
// INTERFACES
// =========================

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Usuario
export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
}

// Categoría
export interface Categoria {
  id?: number;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
}

// Movimiento (Ingreso o Gasto)
export interface Movimiento {
  id?: number;
  monto: number;
  fecha: string;
  tipo: 'INGRESO' | 'GASTO';
  categoriaId: number;
  descripcion?: string;
}

// =========================
// USUARIO
// =========================

export async function registrarUsuario(usuario: Usuario): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  const data: ApiResponse<Usuario> = await response.json();
  return data.data;
}

export async function login(email: string, password: string): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data: ApiResponse<Usuario> = await response.json();
  return data.data;
}

// =========================
// CATEGORÍAS
// =========================

export async function obtenerCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_BASE_URL}/categorias`);
  const data: ApiResponse<Categoria[]> = await response.json();
  return data.data;
}

export async function crearCategoria(categoria: Categoria): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });

  const data: ApiResponse<Categoria> = await response.json();
  return data.data;
}

// =========================
// MOVIMIENTOS (INGRESOS / GASTOS)
// =========================

export async function obtenerMovimientos(): Promise<Movimiento[]> {
  const response = await fetch(`${API_BASE_URL}/movimientos`);
  const data: ApiResponse<Movimiento[]> = await response.json();
  return data.data;
}

export async function crearMovimiento(movimiento: Movimiento): Promise<Movimiento> {
  const response = await fetch(`${API_BASE_URL}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movimiento),
  });

  const data: ApiResponse<Movimiento> = await response.json();
  return data.data;
}

export async function eliminarMovimiento(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/movimientos/${id}`, {
    method: 'DELETE',
  });
}

// =========================
// PRESUPUESTO
// =========================

export async function obtenerPresupuesto(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/presupuesto`);
  const data: ApiResponse<number> = await response.json();
  return data.data;
}

export async function actualizarPresupuesto(valor: number): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/presupuesto`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor }),
  });

  const data: ApiResponse<number> = await response.json();
  return data.data;
}

// =========================
// LOCAL STORAGE (AUTH)
// =========================

export function guardarUsuario(usuario: Usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function obtenerUsuario(): Usuario | null {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem('usuario');
}
