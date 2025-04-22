import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { searchLibreta } from "@/services/libretaService";
import { Libreta } from "@/types";

// Función para obtener el estudiante_id del token
const jwtData = () => {
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

      return JSON.parse(decoded).estudiante_id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);

      return null;
    }
  }

  return null;
};

// Función para convertir calificaciones numéricas a conceptos
const convertirCalificacion = (calificacion: number | null, esConcepto: boolean) => {
  if (calificacion === null) return "-";
  
  if (!esConcepto) return calificacion.toString();

  switch (calificacion) {
    case 70:
      return "MB";
    case 50:
      return "B";
    case 40:
      return "S";
    case 30:
      return "I";
    default:
      return calificacion.toString();
  }
};

export default function NotasPage() {
  const [libreta, setLibreta] = useState<Libreta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const estudiante_id = jwtData();
    
    if (!estudiante_id) {
      setError("No se encontró el ID del estudiante");
      setLoading(false);

      return;
    }

    searchLibreta(estudiante_id)
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

        {loading && (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
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
                          {convertirCalificacion(asignatura[`calificacion${i + 1}`] as number | null, Boolean(asignatura.concepto))}
                        </td>
                      ))}
                      {/* Segundo Semestre */}
                      {[...Array(11)].map((_, i) => (
                        <td
                          key={i + 12}
                          className="border border-gray-300 px-2 py-2"
                        >
                          {convertirCalificacion(asignatura[`calificacion${i + 13}`] as number | null, Boolean(asignatura.concepto))}
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
