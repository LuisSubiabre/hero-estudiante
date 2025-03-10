import React, { useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { DecodedToken } from "@/types/index.ts"; // Importa los tipos
import { useAuth } from "@/context/AuthContext";
// Importa los tipos

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchAuth();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, clave: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();

      localStorage.setItem("TokenLeu", data.token);
      const token = localStorage.getItem("TokenLeu");

      if (!token) {
        throw new Error("No se pudo obtener el token");
      }

      const decodedToken: DecodedToken = jwtDecode(token);

      setIsAuthenticated(true);
      setUser({
        user_id: decodedToken.estudiante_id,
        nombre: decodedToken.nombre,
        email: decodedToken.email,
        curso: decodedToken.curso_nombre,
        rut: decodedToken.rut,
        curso_nombre: decodedToken.curso_nombre,
      });

      navigate("/");
    } catch (error) {
      console.error("Error en fetchAuth:", error);
      throw error;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-8">
        <div className="text-center space-y-2">
          <img
            alt="LEUMAG"
            className="mx-auto w-24 h-24 object-contain"
            src="/images/logo.png"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Liceo Experimental Umag
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Portal del Estudiante
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            isRequired
            className="w-full"
            label="Correo Electrónico"
            labelPlacement="outside"
            size="lg"
            type="email"
            value={email}
            variant="bordered"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            isRequired
            className="w-full pt-4"
            label="Contraseña"
            labelPlacement="outside"
            size="lg"
            type="password"
            value={password}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full font-semibold"
            color="primary"
            disabled={loading || !email || !password}
            isLoading={loading}
            size="lg"
            type="submit"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {/* <p>¿Necesitas ayuda? Contacta a tu profesor jefe</p> */}
        </div>
      </Card>
    </section>
  );
};

export default LoginForm;
