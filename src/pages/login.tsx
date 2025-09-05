import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [rut, setRut] = useState("");
  const [loadingRecovery, setLoadingRecovery] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoverySuccess(false);
    setLoadingRecovery(true);

    try {
      const formattedRut = rut.toUpperCase();
      const response = await fetch(
        `${import.meta.env.VITE_URL_BASE}/recuperar-clave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rut: formattedRut }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message || "Error al recuperar la contraseña"
        );
      }

      setRecoverySuccess(true);
    } catch (error) {
      setRecoveryError((error as Error).message);
    } finally {
      setLoadingRecovery(false);
    }
  };

  const validateRut = (value: string) => {
    // Primero actualizamos el valor del input
    setRut(value);

    // Si el campo está vacío, no mostramos error
    if (!value) {
      setRecoveryError("");

      return;
    }

    // Eliminar puntos y convertir guión en K si es necesario
    const rutClean = value.replace(/\./g, "").replace(/k$/i, "K");

    // Validar formato (XXXXXXXX-X)
    const rutRegex = /^[0-9]{7,8}-[0-9K]$/;

    if (!rutRegex.test(rutClean)) {
      setRecoveryError("Formato de RUT inválido. Debe ser XXXXXXXX-X");
    } else {
      setRecoveryError("");
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
            Liceo Experimental Umag.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Portal del Estudiante
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                ¿Qué encontrarás en la plataforma?
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Consulta de calificaciones</li>
                <li>• Control de asistencia y atrasos</li>
                <li>• Certificado Alumno Regular</li>
                <li>• Informe de Personalidad</li>
                <li>• ACLES</li>
             
              </ul>
   
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            isRequired
            className="w-full"
            label="Correo Electrónico"
            labelPlacement="inside"
            placeholder="Ingresa tu correo electrónico"
            size="lg"
            type="email"
            value={email}
            variant="bordered"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            isRequired
            className="w-full"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            }
            label="Contraseña"
            labelPlacement="inside"
            placeholder="Ingresa tu contraseña"
            size="lg"
            type={showPassword ? "text" : "password"}
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
          <button
            className="text-primary hover:underline focus:outline-none"
            type="button"
            onClick={onOpen}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Recuperar Contraseña</ModalHeader>
          <ModalBody>
            <form className="space-y-4" onSubmit={handleRecoverySubmit}>
              <Input
                isRequired
                description="Ingresa tu RUT sin puntos y con guión (Ejemplo: 12345678-9)"
                label="RUT"
                placeholder="12345678-9"
                value={rut}
                onChange={(e) => validateRut(e.target.value)}
              />

              {recoveryError && (
                <div className="text-red-500 text-sm">{recoveryError}</div>
              )}

              {recoverySuccess && (
                <div className="text-green-500 text-sm">
                  Se ha enviado un correo con las instrucciones para recuperar
                  tu contraseña.
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  disabled={!rut || !!recoveryError}
                  isLoading={loadingRecovery}
                  type="submit"
                >
                  Recuperar
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default LoginForm;