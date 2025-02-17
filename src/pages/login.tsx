import React, { useState } from "react";
import { Input, Button, Spacer } from "@heroui/react";
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
      const response = await fetch("http://localhost:3500/login", {
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

      const decodedToken: DecodedToken = jwtDecode(token); // Usa el tipo DecodedToken

      setIsAuthenticated(true);
      setUser({
        user_id: decodedToken.estudiante_id,
        nombre: decodedToken.nombre, // Usa el nombre del token si está disponible
        email: decodedToken.email,
        curso: decodedToken.curso_nombre,
        rut: decodedToken.rut, // Agregar rut desde el token
        curso_nombre: decodedToken.curso_nombre,
      });

      navigate("/");
    } catch (error) {
      console.error("Error en fetchAuth:", error);
      throw error;
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Inicia Sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <Input
                fullWidth
                required
                label="Email"
                placeholder=""
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Spacer y={1} />
              <Input
                fullWidth
                required
                label="Password"
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Spacer y={1.5} />
              {error && (
                <div className="text-red-500 text-sm">
                  {error} {/* Muestra el mensaje de error si hay uno */}
                </div>
              )}

              <Button
                fullWidth
                color="primary"
                disabled={loading}
                type="submit"
              >
                {loading ? "Cargando..." : "Acceder"}{" "}
                {/* Mostrar estado de carga */}
              </Button>
            </form>
          </div>{" "}
        </div>{" "}
      </div>
    </section>
  );
};

export default LoginForm;
