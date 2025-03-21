// Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Si usas React Router

import { useAuth } from "@/context/AuthContext"; // Asumiendo que usas el contexto de autenticación

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Ejecuta el logout
    navigate("/login"); // Redirige al login (puedes cambiar la ruta según lo necesites)
  }, [logout, navigate]);

  return <div>Logging out...</div>; // Puedes mostrar un mensaje de carga mientras se realiza el logout
};

export default Logout;
