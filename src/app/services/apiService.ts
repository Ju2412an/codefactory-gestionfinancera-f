// URL base del backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

// =========================
// API RESPONSE
// =========================

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

// =========================
// USUARIOS
// =========================

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
// HELPERS
// =========================

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...init,
      headers: {
        "Content-Type":"application/json",
        ...(init?.headers || {}),
      },
    }
  );

  let body: ApiResponse<T> | null = null;

  try {
    body = await response.json();
  } catch {}

  if (
    !response.ok ||
    (body && body.success === false)
  ) {

    throw new Error(
      body?.message ||
      `Error ${response.status}`
    );

  }

  return body?.data as T;
}

async function rawRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...init,
      headers: {
        "Content-Type":"application/json",
        ...(init?.headers || {}),
      },
    }
  );

  if (!response.ok) {

    let msg = `Error ${response.status}`;

    try {

      const text = await response.text();

      if (text) msg = text;

    } catch {}

    throw new Error(msg);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  return text
    ? JSON.parse(text)
    : (undefined as T);
}

// =========================
// MODELOS
// =========================

export type TipoCategoria =
  | "INGRESO"
  | "GASTO";

export interface Categoria {
  id?: number;
  nombre: string;
  tipo: TipoCategoria;
}

export interface Presupuesto {
  id?: number;
  presupuestoInicial: number;
  total: number;
}

export interface MovimientoInput {
  valor: number;
  categoriaId: number;
  descripcion?: string;
}

export interface Movimiento {
  id: number;
  tipo: TipoCategoria;
  valor: number;
  descripcion?: string;
  fecha: string;
  categoriaId?: number;
  categoriaNombre?: string;
}

// =========================
// DTO SPRINT 3
// =========================

export interface BalanceMensual {
  totalIngresos: number;
  totalGastos: number;
  saldoActual: number;
}

export interface AlertaPresupuesto {
  alertaActiva: boolean;
  porcentajeGastado: number;
  totalGastado: number;
  presupuestoActual: number;
  mensaje: string;
}

export interface Recomendacion {
  recomendaciones: string[];
}

// =========================
// AUTH LOCAL STORAGE
// =========================

const STORAGE_KEY = "usuario";

export function guardarUsuario(
  usuario: Usuario
): void {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(usuario)
  );
}

export function obtenerUsuarioLocal():
  Usuario | null {

  const raw =
    localStorage.getItem(STORAGE_KEY);

  return raw
    ? JSON.parse(raw)
    : null;
}

export function limpiarAutenticacion() {

  localStorage.removeItem(STORAGE_KEY);

}

export function estaAutenticado() {

  return obtenerUsuarioLocal() !== null;

}

// =========================
// HELPERS USER ID
// =========================

function requireUsuarioId(): number {

  const usuario =
    obtenerUsuarioLocal();

  if (!usuario?.id) {

    throw new Error(
      "No hay usuario autenticado"
    );

  }

  return usuario.id;
}

function withUsuarioId(
  path: string
): string {

  const sep =
    path.includes("?")
      ? "&"
      : "?";

  return (
    `${path}${sep}usuarioId=` +
    requireUsuarioId()
  );
}

// =========================
// USUARIOS API
// =========================

export async function registrarUsuario(
  email: string,
  nombre: string,
  apellido: string,
  password: string,
): Promise<Usuario> {

  return request<Usuario>(
    "/usuarios/registro",
    {
      method:"POST",
      body: JSON.stringify({
        email,
        nombre,
        apellido,
        password,
      }),
    }
  );
}

export async function login(
  email: string,
  password: string,
): Promise<Usuario> {

  return request<Usuario>(
    "/usuarios/autenticar",
    {
      method:"POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}

export async function listarUsuarios() {

  return request<Usuario[]>(
    "/usuarios"
  );
}

export async function obtenerUsuarioPorId(
  id: number,
) {

  return request<Usuario>(
    `/usuarios/${id}`
  );
}

// =========================
// CATEGORIAS API
// =========================

export async function obtenerCategorias() {

  return rawRequest<Categoria[]>(
    "/categorias"
  );
}

export async function crearCategoria(
  nombre: string,
  tipo: TipoCategoria,
) {

  return rawRequest<Categoria>(
    "/categorias",
    {
      method:"POST",
      body: JSON.stringify({
        nombre,
        tipo,
      }),
    }
  );
}

// =========================
// PRESUPUESTO
// =========================

export async function obtenerPresupuesto():
Promise<Presupuesto | null> {

  try {

    return await rawRequest<Presupuesto>(
      withUsuarioId("/gastos")
    );

  } catch {

    return null;

  }
}

export async function inicializarPresupuesto(
  valor: number,
) {

  return rawRequest<Presupuesto>(
    withUsuarioId(
      `/gastos/inicializar/${valor}`
    ),
    {
      method:"POST",
    }
  );
}

// =========================
// INGRESOS / GASTOS
// =========================

export async function registrarIngreso(
  input: MovimientoInput,
) {

  return rawRequest<Presupuesto>(
    withUsuarioId(
      "/gastos/ingreso"
    ),
    {
      method:"POST",
      body: JSON.stringify(input),
    }
  );
}

export async function registrarGasto(
  input: MovimientoInput,
) {

  return rawRequest<Presupuesto>(
    withUsuarioId(
      "/gastos/gasto"
    ),
    {
      method:"POST",
      body: JSON.stringify(input),
    }
  );
}

export async function listarMovimientos() {

  return rawRequest<Movimiento[]>(
    withUsuarioId(
      "/gastos/movimientos"
    )
  );
}

// =========================
// SPRINT 3
// =========================

export async function obtenerBalanceMensual(): Promise<BalanceMensual> {
  return rawRequest<BalanceMensual>(
    withUsuarioId("/gastos/balance-mensual")
  );
}

export async function obtenerAlertaPresupuesto(): Promise<AlertaPresupuesto> {
  return rawRequest<AlertaPresupuesto>(
    withUsuarioId("/gastos/alerta-presupuesto")
  );
}

export async function obtenerRecomendaciones(): Promise<Recomendacion> {
  return rawRequest<Recomendacion>(
    withUsuarioId("/gastos/recomendaciones")
  );
}

