// API Service para comunicarse con el backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Interfaces para respuestas
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  autenticado: boolean;
  fechaRegistro: string;
}

export interface Espacio {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number;
  estado: string;
  fechaCreacion: string;
}

export interface Franja {
  horaInicio: string;
  horaFin: string;
  estado: string; // DISPONIBLE o OCUPADO
  reservaId?: number | null;
}

export interface Calendario {
  espacioId: number;
  espacioNombre: string;
  fecha: string;
  franjas: Franja[];
  totalDisponibles: number;
  totalOcupados: number;
  tieneDisponibilidad: boolean;
}

export interface Reserva {
  id?: number;
  usuarioId: number;
  espacioId: number;
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
  fechaCreacion?: string;
}

// Servicio de Autenticación
export async function autenticar(email: string, password: string): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/autenticar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data: ApiResponse<Usuario> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error en la autenticación');
  }

  return data.data as Usuario;
}

// Servicio de Espacios
export async function obtenerEspacios(): Promise<Espacio[]> {
  const response = await fetch(`${API_BASE_URL}/espacios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<Espacio[]> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener espacios');
  }

  return data.data as Espacio[];
}

export async function obtenerEspacio(id: number): Promise<Espacio> {
  const response = await fetch(`${API_BASE_URL}/espacios/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<Espacio> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener espacio');
  }

  return data.data as Espacio;
}

// Servicio de Calendario
export async function obtenerCalendario(espacioId: number, fecha: string): Promise<Calendario> {
  const response = await fetch(`${API_BASE_URL}/calendario/dia/${espacioId}?fecha=${fecha}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<Calendario> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener calendario');
  }

  return data.data as Calendario;
}

// Servicio de Reservas
export async function crearReserva(reserva: Reserva): Promise<Reserva> {
  const response = await fetch(`${API_BASE_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reserva),
  });

  const data: ApiResponse<Reserva> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al crear la reserva');
  }

  return data.data as Reserva;
}

export async function obtenerReserva(id: number): Promise<Reserva> {
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<Reserva> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener reserva');
  }

  return data.data as Reserva;
}

export async function cancelarReserva(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ApiResponse<null> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al cancelar reserva');
  }
}

// Servicio de Usuarios
export async function registrarUsuario(email: string, nombre: string, apellido: string, password: string): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, nombre, apellido, password }),
  });

  const data: ApiResponse<Usuario> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al registrar usuario');
  }

  return data.data as Usuario;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data: ApiResponse<Usuario[]> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al listar usuarios');
  }

  return data.data as Usuario[];
}

export async function obtenerUsuario(id: number): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data: ApiResponse<Usuario> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener usuario');
  }

  return data.data as Usuario;
}

// Funciones de utilidad para localStorage
export function guardarUsuarioLocal(usuario: Usuario): void {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('isAuthenticated', 'true');
}

export function obtenerUsuarioLocal(): Usuario | null {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

export function limpiarAutenticacion(): void {
  localStorage.removeItem('usuario');
  localStorage.removeItem('isAuthenticated');
}

export function estaAutenticado(): boolean {
  return localStorage.getItem('isAuthenticated') === 'true';
}
