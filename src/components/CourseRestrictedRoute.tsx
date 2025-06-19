import { Spinner } from "@heroui/react";
import { Navigate } from "react-router-dom";

import { useJWT } from "@/hooks/useJWT";

interface CourseRestrictedRouteProps {
  children: React.ReactNode;
}

const CourseRestrictedRoute: React.FC<CourseRestrictedRouteProps> = ({ children }) => {
  const { curso_id } = useJWT();

  // Si no se puede obtener el curso_id, mostrar spinner
  if (curso_id === undefined) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // Si el curso_id está entre 1 y 5, redirigir a la página principal
  if (curso_id >= 1 && curso_id <= 5) {
    return <Navigate replace to="/" />;
  }

  // Si el curso_id no está en el rango restringido, mostrar el contenido
  return <>{children}</>;
};

export default CourseRestrictedRoute; 