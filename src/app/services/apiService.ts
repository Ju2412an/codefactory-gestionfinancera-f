// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// =========================
// TIPOS (alineados con backend)
// =========================

// Coincide con com.pruebareservas.dto.ApiResponseDTO
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

// Coincide con com.pruebareservas.dto.UsuarioDTO
export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  apellido: string;
  autenticado?: boolean;
  fechaRegistro?: string;
  password?: string;
}

// =========================
// HELPER
// =========================

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = await response.json();
  } catch {
    // sin cuerpo o cuerpo no-JSON
  }

  if (!response.ok || (body && body.success === false)) {
    const msg = body?.message || `Error ${response.status}`;
    throw new Error(msg);
  }

  return (body?.data ?? (undefined as unknown)) as T;
}

// =========================
// USUARIOS
// =========================

// POST /api/usuarios/registro  body: {email, nombre, apellido, password}
export async function registrarUsuario(
  email: string,
  nombre: string,
  apellido: string,
  password: string,
): Promise<Usuario> {
  return request<Usuario>('/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify({ email, nombre, apellido, password }),
  });
}

// POST /api/usuarios/autenticar  body: {email, password}
export async function login(email: string, password: string): Promise<Usuario> {
  return request<Usuario>('/usuarios/autenticar', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// GET /api/usuarios
export async function listarUsuarios(): Promise<Usuario[]> {
  return request<Usuario[]>('/usuarios');
}

// GET /api/usuarios/{id}
export async function obtenerUsuarioPorId(id: number): Promise<Usuario> {
  return request<Usuario>(`/usuarios/${id}`);
}

// =========================
// AUTH LOCAL (localStorage)
// =========================

const STORAGE_KEY = 'usuario';

export function guardarUsuario(usuario: Usuario): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function obtenerUsuarioLocal(): Usuario | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}

export function limpiarAutenticacion(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function estaAutenticado(): boolean {
  return obtenerUsuarioLocal() !== null;
}
