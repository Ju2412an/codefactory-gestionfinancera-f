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
// MODELOS DE DOMINIO (alineados con back)
// =========================

export type TipoCategoria = 'INGRESO' | 'GASTO';

// Coincide con com.pruebareservas.entity.CategoriaEntity
export interface Categoria {
  id?: number;
  nombre: string;
  tipo: TipoCategoria;
}

// Coincide con com.pruebareservas.entity.PresupuestoEntity
export interface Presupuesto {
  id?: number;
  total: number;
}

// Coincide con com.pruebareservas.dto.MovimientoDTO (request)
export interface MovimientoInput {
  valor: number;
  categoriaId: number;
  descripcion?: string;
}

// Coincide con com.pruebareservas.dto.MovimientoDTO (response)
export interface Movimiento {
  id: number;
  tipo: TipoCategoria; // INGRESO | GASTO
  valor: number;
  descripcion?: string;
  fecha: string;
  categoriaId?: number;
  categoriaNombre?: string;
}

// =========================
// HELPER SIN ENVELOPE (endpoints que devuelven la entidad cruda)
// =========================

async function rawRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let msg = `Error ${response.status}`;
    try {
      const text = await response.text();
      if (text) msg = text;
    } catch {
      // ignorar
    }
    throw new Error(msg);
  }

  if (response.status === 204) return undefined as unknown as T;

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
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
// CATEGORÍAS
// =========================

// GET /api/categorias
export async function obtenerCategorias(): Promise<Categoria[]> {
  return rawRequest<Categoria[]>('/categorias');
}

// POST /api/categorias  body: {nombre, tipo}
export async function crearCategoria(nombre: string, tipo: TipoCategoria): Promise<Categoria> {
  return rawRequest<Categoria>('/categorias', {
    method: 'POST',
    body: JSON.stringify({ nombre, tipo }),
  });
}

// =========================
// PRESUPUESTO + MOVIMIENTOS (scoped al usuario logueado)
// =========================

function requireUsuarioId(): number {
  const u = obtenerUsuarioLocal();
  if (!u || u.id == null) {
    throw new Error('No hay usuario autenticado');
  }
  return u.id;
}

function withUsuarioId(path: string): string {
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}usuarioId=${requireUsuarioId()}`;
}

// GET /api/gastos?usuarioId=X
export async function obtenerPresupuesto(): Promise<Presupuesto | null> {
  try {
    return await rawRequest<Presupuesto>(withUsuarioId('/gastos'));
  } catch {
    // El back lanza si no hay presupuesto inicializado para este usuario
    return null;
  }
}

// POST /api/gastos/inicializar/{valor}?usuarioId=X
export async function inicializarPresupuesto(valor: number): Promise<Presupuesto> {
  return rawRequest<Presupuesto>(
    withUsuarioId(`/gastos/inicializar/${encodeURIComponent(valor)}`),
    { method: 'POST' },
  );
}

// POST /api/gastos/ingreso?usuarioId=X
export async function registrarIngreso(input: MovimientoInput): Promise<Presupuesto> {
  return rawRequest<Presupuesto>(withUsuarioId('/gastos/ingreso'), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// POST /api/gastos/gasto?usuarioId=X
export async function registrarGasto(input: MovimientoInput): Promise<Presupuesto> {
  return rawRequest<Presupuesto>(withUsuarioId('/gastos/gasto'), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// GET /api/gastos/movimientos?usuarioId=X
export async function listarMovimientos(): Promise<Movimiento[]> {
  return rawRequest<Movimiento[]>(withUsuarioId('/gastos/movimientos'));
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
