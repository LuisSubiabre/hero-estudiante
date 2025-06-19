import { useMemo } from 'react';

interface JWTPayload {
  estudiante_id: number;
  nombre: string;
  email: string;
  rut: string;
  curso_nombre: string;
  curso_id: number;
}

export const useJWT = () => {
  const jwtData = useMemo(() => {
    const token = localStorage.getItem("TokenLeu");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = decodeURIComponent(
          atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const payload = JSON.parse(decoded) as JWTPayload;

        console.log("JWT decodificado:", payload);
        console.log("curso_id:", payload.curso_id);

        return payload;
      } catch (error) {
        console.error("Error al decodificar el token:", error);

        return null;
      }
    }

    return null;
  }, []);

  return {
    jwtData,
    curso_id: jwtData?.curso_id,
    estudiante_id: jwtData?.estudiante_id,
    nombre: jwtData?.nombre,
    email: jwtData?.email,
    rut: jwtData?.rut,
    curso_nombre: jwtData?.curso_nombre,
  };
}; 