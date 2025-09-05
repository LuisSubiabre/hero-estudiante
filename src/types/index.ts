import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  user_id: string;
  nombre: string;
  email: string;
  curso: string;
  rut: string;
  curso_nombre: string; // Add curso_nombre property
}

export interface DecodedToken {
  estudiante_id: string;
  email: string;
  curso_nombre: string;
  rut: string;
  nombre: string;
  acceso_encuesta_fd: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
}

// Tipos relacionados con el formulario de login
export interface LoginFormValues {
  email: string;
  password: string;
}

// Tipos relacionados con la respuesta del servidor
export interface AuthResponse {
  token: string;
  message?: string;
}

// Tipos relacionados con errores
export interface ApiError {
  message: string;
}

export interface Asignatura {
  asignatura_id: number;
  indice: number;
  nombre_asignatura: string;
  [key: string]: number | string | null;
}

export interface Libreta {
  nombre_estudiante: string;
  curso_nombre: string;
  profesor_jefe_nombre: string;
  asignaturas: Asignatura[];
}

export interface Taller {
  taller_id: number;
  nombre: string;
  descripcion?: string;
  horario: string;
  ubicacion: string;
  cantidad_cupos: number;
  cantidad_inscritos: number;
}

export interface Atraso {
  id: number;
  fecha: string;
  hora: string;
  tipo: string;
  justificado: boolean;
  observaciones: string;
  fecha_registro: string;
}

export interface AtrasosResponse {
  data: {
    estudiante: {
      nombre: string;
      rut: string;
    };
    atrasos: Atraso[];
  };
}

// Tipos para Formación Diferenciada (FD)
export interface AsignaturaEncuesta {
  asignatura_encuesta_id: number;
  nombre: string;
  descripcion?: string;
  bloque: string;
  area: string;
  cupos_disponibles: number;
  cupos_totales: number;
  profesor?: string;
  horario?: string;
  ubicacion?: string;
  requisitos?: string;
  activa: boolean;
}

export interface BloqueFD {
  nombre: string;
  descripcion?: string;
  asignaturas: AsignaturaEncuesta[];
}

export interface AreaFD {
  nombre: string;
  descripcion?: string;
  asignaturas: AsignaturaEncuesta[];
}

export interface EleccionEstudiante {
  asignatura_encuesta_id: number;
  nombre_asignatura: string;
  bloque: string;
  area: string;
  fecha_inscripcion: string;
  estado: 'activa' | 'cancelada';
}

export interface ResumenElecciones {
  estudiante: {
    nombre: string;
    rut: string;
    curso: string;
  };
  elecciones: EleccionEstudiante[];
  total_elecciones: number;
  elecciones_activas: number;
}

export interface EstudianteAsignatura {
  estudiante_id: number;
  nombre: string;
  rut: string;
  curso: string;
  fecha_inscripcion: string;
}

export interface InscripcionRequest {
  asignatura_encuesta_id: number;
}

export interface InscripcionResponse {
  success: boolean;
  message: string;
  data?: {
    inscripcion_id: number;
    fecha_inscripcion: string;
  };
}