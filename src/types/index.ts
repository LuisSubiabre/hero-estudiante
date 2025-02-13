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
