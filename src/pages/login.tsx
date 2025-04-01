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
import { Link } from "@heroui/link";

import packageJson from "../../package.json";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-8 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                alt="LEUMAG"
                className="mx-auto w-28 h-28 object-contain transform transition-transform duration-300 hover:scale-105"
                src="/images/logo.png"
              />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl -z-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Liceo Experimental Umag
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Portal del Estudiante
            </p>
          </div>

          <form className="space-y-8 py-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                isRequired
                className="w-full"
                classNames={{
                  input: "text-base",
                  inputWrapper: "shadow-sm hover:shadow-md transition-shadow duration-200",
                  label: "text-gray-700 dark:text-gray-300 font-medium"
                }}
                label="Correo Electrónico"
                labelPlacement="outside"
                size="lg"
                type="email"
                value={email}
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                isRequired
                className="w-full"
                classNames={{
                  input: "text-base",
                  inputWrapper: "shadow-sm hover:shadow-md transition-shadow duration-200",
                  label: "text-gray-700 dark:text-gray-300 font-medium"
                }}
                endContent={
                  <button
                    className="focus:outline-none p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
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
                labelPlacement="outside"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={password}
                variant="bordered"
                onBlur={(e) => setPassword(e.target.value.toUpperCase())}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center gap-3 animate-fade-in">
                <svg
                  className="w-5 h-5 flex-shrink-0"
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
                <span className="font-medium">{error}</span>
              </div>
            )}

            <Button
              className="w-full font-semibold h-12 text-base shadow-md hover:shadow-lg transition-all duration-200"
              color="primary"
              disabled={loading || !email || !password}
              isLoading={loading}
              size="lg"
              type="submit"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="text-center">
            <button
              className="text-primary hover:text-primary-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-2"
              type="button"
              onClick={onOpen}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </Card>
      </div>

      <footer className="w-full flex items-center justify-center py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <span className="text-gray-600 dark:text-gray-400">Desarrollado por</span>
        <Link
          isExternal
          className="flex items-center gap-1 text-current hover:text-primary transition-colors duration-200"
          href="https://liceoexperimental.cl"
          title="Leumag homepage"
        >
          <p className="text-primary mx-2 font-medium"> Liceo Experimental Umag </p>
        </Link>
        <span className="text-gray-600 dark:text-gray-400">v{packageJson.version}</span>
      </footer>

      <Modal 
        classNames={{
          base: "bg-white dark:bg-gray-800",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-200 dark:border-gray-700"
        }} 
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="text-xl font-bold">Recuperar Contraseña</ModalHeader>
          <ModalBody>
            <form className="space-y-4" onSubmit={handleRecoverySubmit}>
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                  inputWrapper: "shadow-sm hover:shadow-md transition-shadow duration-200",
                  label: "text-gray-700 dark:text-gray-300 font-medium"
                }}
                errorMessage={recoveryError}
                isInvalid={!!recoveryError}
                label="RUT"
                placeholder="Ej: 12345678-9"
                value={rut}
                onChange={(e) => validateRut(e.target.value)}
              />
              {recoverySuccess && (
                <div className="p-4 text-sm text-success bg-success-50 dark:bg-success-900/30 rounded-lg flex items-center gap-3 animate-fade-in">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-medium">
                    Se ha enviado un correo con las instrucciones para recuperar tu contraseña.
                  </span>
                </div>
              )}
              <Button
                className="w-full h-12 text-base shadow-md hover:shadow-lg transition-all duration-200"
                color="primary"
                isLoading={loadingRecovery}
                type="submit"
              >
                {loadingRecovery ? "Enviando..." : "Recuperar Contraseña"}
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LoginForm;
