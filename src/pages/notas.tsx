import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { searchLibreta } from "@/services/libretaService";
import { Libreta } from "@/types";

export default function NotasPage() {
  const [libreta, setLibreta] = useState<Libreta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    searchLibreta(325)
      .then((data) => {
        if (data) {
          setLibreta(data);
        } else {
          setError("No se encontró la libreta");
        }
      })
      .catch((error) => {
        setError("Hubo un error al cargar la libreta " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>
            Notas de: {libreta ? libreta.nombre_estudiante : "Cargando..."}
          </h1>
          <h2 className="text-lg text-gray-700">{libreta?.curso_nombre}</h2>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && libreta && (
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2" rowSpan={2}>
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2" rowSpan={2}>
                    Asignatura
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 bg-blue-100"
                    colSpan={12}
                  >
                    Primer Semestre
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 bg-green-100"
                    colSpan={11}
                  >
                    Segundo Semestre
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  {[...Array(12)].map((_, i) => (
                    <th key={i} className="border border-gray-300 px-2 py-2">
                      {i + 1}
                    </th>
                  ))}
                  {[...Array(11)].map((_, i) => (
                    <th
                      key={i + 12}
                      className="border border-gray-300 px-2 py-2"
                    >
                      {i + 13}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {libreta.asignaturas
                  .sort((a, b) => a.indice - b.indice)
                  .map((asignatura) => (
                    <tr key={asignatura.asignatura_id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {asignatura.indice}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {asignatura.nombre_asignatura}
                      </td>
                      {/* Primer Semestre */}
                      {[...Array(12)].map((_, i) => (
                        <td
                          key={i}
                          className="border border-gray-300 px-2 py-2"
                        >
                          {asignatura[`calificacion${i + 1}`] ?? "-"}
                        </td>
                      ))}
                      {/* Segundo Semestre */}
                      {[...Array(11)].map((_, i) => (
                        <td
                          key={i + 12}
                          className="border border-gray-300 px-2 py-2"
                        >
                          {asignatura[`calificacion${i + 13}`] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
