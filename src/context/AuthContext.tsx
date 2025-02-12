import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

import { AuthContextType, User, DecodedToken } from "@/types/index.ts"; // Importa los tipos

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    user_id: "",
    nombre: "",
    email: "",
    curso: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("TokenLeu");

    const verifyToken = () => {
      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);

          setIsAuthenticated(true);
          setUser({
            user_id: decodedToken.estudiante_id,
            nombre: decodedToken.email.split("@")[0],
            email: decodedToken.email,
            curso: decodedToken.curso_nombre,
          });
        } catch (error) {
          console.error("Error decodificando el token:", error);
          setIsAuthenticated(false);
          localStorage.removeItem("TokenLeu"); // Limpia el token inválido
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
