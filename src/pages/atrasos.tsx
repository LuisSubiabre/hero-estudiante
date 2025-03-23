import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { AtrasosResponse } from "@/types";
import { getAtrasos } from "@/services/atrasosService";

export default function DocsPage() {
  const [atrasosData, setAtrasosData] = useState<AtrasosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAtrasos(696)
      .then((response) => {
        if (response) {
          setAtrasosData(response);
        } else {
          setError("No se encontró la libreta");
        }
      })
      .catch((error) => {
        setError("Hubo un error al cargar los atrasos " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
              <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {atrasosData.data.estudiante.nombre}
                </h2>
                <p className="text-gray-600 text-lg">
                  RUT: {atrasosData.data.estudiante.rut}
                </p>
              </div>
              <div className="space-y-4">
                {atrasosData.data.atrasos.map((atraso) => (
                  <div
                    key={atraso.id}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-500 text-lg font-semibold">
                            {new Date(atraso.fecha).toLocaleDateString(
                              "es-CL",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                clipRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                fillRule="evenodd"
                              />
                            </svg>
                            <span>{atraso.hora}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                clipRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                fillRule="evenodd"
                              />
                            </svg>
                            <span className="capitalize">{atraso.tipo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {atraso.observaciones && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600 italic">
                          {atraso.observaciones}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
