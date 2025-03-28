import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { AtrasosResponse } from "@/types";
import { getAtrasos } from "@/services/atrasosService";

// Función para obtener el estudiante_id del token
const jwtData = () => {
  const token = localStorage.getItem("TokenLeu");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.estudiante_id;
    } catch {
      return null;
    }
  }

  return null;
};

export default function DocsPage() {
  const [atrasosData, setAtrasosData] = useState<AtrasosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const estudiante_id = jwtData();

    if (!estudiante_id) {
      setError("No se encontró el ID del estudiante.");
      setLoading(false);

      return;
    }

    getAtrasos(estudiante_id)
      .then((response) => {
        if (response) {
          setAtrasosData(response);
          setError("");
        } else {
          setAtrasosData({
            data: {
              estudiante: {
                nombre: "",
                rut: "",
              },
              atrasos: [],
            },
          });
          setError("");
        }
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          setAtrasosData({
            data: {
              estudiante: {
                nombre: "",
                rut: "",
              },
              atrasos: [],
            },
          });
          setError("");
        } else {
          setError("Hubo un error al cargar los atrasos: " + error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const atrasosLlegada =
    atrasosData?.data.atrasos.filter((atraso) => atraso.tipo === "llegada") ||
    [];
  const atrasosJornada =
    atrasosData?.data.atrasos.filter((atraso) => atraso.tipo === "jornada") ||
    [];

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("es-CL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1 className={title()}>Registro de Atrasos</h1>
          {loading && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {atrasosData && (
            <div className="w-full">
              {atrasosData.data.estudiante.nombre && (
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {atrasosData.data.estudiante.nombre}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    RUT: {atrasosData.data.estudiante.rut}
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Atrasos de Llegada */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Atrasos de Llegada
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Registro de llegadas tardías al establecimiento
                  </p>
                  <div className="space-y-4">
                    {atrasosLlegada.length > 0 ? (
                      atrasosLlegada.map((atraso) => (
                        <div
                          key={atraso.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-600 font-medium">
                              {formatDate(atraso.fecha)}
                            </span>
                            <span className="text-gray-500">{atraso.hora}</span>
                          </div>
                          {atraso.observaciones && (
                            <p className="text-gray-600 text-sm italic">
                              {atraso.observaciones}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No hay atrasos de llegada registrados
                      </p>
                    )}
                  </div>
                </div>

                {/* Atrasos de Jornada */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg
                        className="h-6 w-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Atrasos de Jornada
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Registro de llegadas tardías a la sala de clases
                  </p>
                  <div className="space-y-4">
                    {atrasosJornada.length > 0 ? (
                      atrasosJornada.map((atraso) => (
                        <div
                          key={atraso.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-600 font-medium">
                              {formatDate(atraso.fecha)}
                            </span>
                            <span className="text-gray-500">{atraso.hora}</span>
                          </div>
                          {atraso.observaciones && (
                            <p className="text-gray-600 text-sm italic">
                              {atraso.observaciones}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No hay atrasos de jornada registrados
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
