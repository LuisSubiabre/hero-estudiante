import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const validateToken = async () => {
  try {
    // Obtiene el token de la sesión actual
    const token = localStorage.getItem("TokenLeu");

    // Si no hay token, retorna false
    if (!token) {
      return false;
    }

    const response = await fetch(
      `${import.meta.env.VITE_URL_BASE}/verify-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Envía solo el token, sin "Bearer"
        },
        body: JSON.stringify({ token }), // Envía el token en el cuerpo
      }
    );

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const data = await response.json();

    // Si el token es válido, retorna true
    return data.isValid;
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();

      setIsValidToken(isValid);
    };

    checkToken();
  }, []);

  // Si aún no se ha verificado el token, muestra un mensaje de carga
  if (isValidToken === null) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // Si el token no es válido, redirige al login
  if (!isValidToken) {
    return <Navigate replace to="/login" />;
  }

  // Si el token es válido, renderiza los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;
