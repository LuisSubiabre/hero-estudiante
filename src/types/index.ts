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
  asignaturas: Asignatura[];
}

export interface Taller {
  taller_id: number;
  nombre: string;
  descripcion?: string;
  horario: string;
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
