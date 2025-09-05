import { Navigate } from "react-router-dom";
import { useJWT } from "@/hooks/useJWT";

interface FDProtectedRouteProps {
  children: React.ReactNode;
}

const FDProtectedRoute: React.FC<FDProtectedRouteProps> = ({ children }) => {
  const { curso_id } = useJWT();

  // Verificar si el curso_id está entre 25 y 30
  const hasAccess = curso_id && curso_id >= 25 && curso_id <= 30;

  if (!hasAccess) {
    // Redirigir a la página principal si no tiene acceso
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default FDProtectedRoute;
