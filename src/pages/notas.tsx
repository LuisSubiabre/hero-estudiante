import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { searchLibreta } from "@/services/libretaService";
import { Libreta } from "@/types";
import configPromedios from "@/config/configPromedios";

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

// Función para calcular el promedio de un conjunto de notas
const calcularPromedio = (notas: (number | null)[], config: typeof configPromedios.promedioAnualAsignatura | typeof configPromedios.promedioGeneralSemestral) => {
  const notasValidas = notas.filter(nota => nota !== null) as number[];
  
  if (notasValidas.length === 0) return null;
  
  const suma = notasValidas.reduce((acc, nota) => acc + nota, 0);
  const promedio = suma / notasValidas.length;
  
  // Para promedioGeneralSemestral, devolver el valor exacto sin redondeo
  if (!config.aproximar) {
    return promedio;
  }
  
  // Para promedioAnualAsignatura, aplicar la regla de aproximación
  if (config.aproximar && 'precision' in config) {
    const decimal = promedio - Math.floor(promedio);
    const base = config.reglaAproximacion?.base || 0;
    
    if (decimal >= base) {
      return Math.ceil(promedio);
    } else {
      return Math.floor(promedio);
    }
  }
  
  return promedio;
};

// Función para obtener las notas de un semestre
const obtenerNotasSemestre = (asignatura: any, inicio: number, fin: number) => {
  return Array.from({ length: fin - inicio + 1 }, (_, i) => 
    asignatura[`calificacion${inicio + i}`] as number | null
  );
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
          <>
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
                    <th className="border border-gray-300 px-4 py-2 bg-blue-100" rowSpan={2}>
                      1S
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-green-100" rowSpan={2}>
                      2S
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-200" rowSpan={2}>
                      PF
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
                    .map((asignatura) => {
                      const notas1S = obtenerNotasSemestre(asignatura, 1, 12);
                      const notas2S = obtenerNotasSemestre(asignatura, 13, 23);
                      const promedio1S = calcularPromedio(notas1S, configPromedios.promedioAnualAsignatura);
                      const promedio2S = calcularPromedio(notas2S, configPromedios.promedioAnualAsignatura);
                      const promedioFinal = calcularPromedio(
                        [promedio1S, promedio2S].filter(nota => nota !== null) as number[],
                        configPromedios.promedioAnualAsignatura
                      );

                      return (
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
                          {/* Promedios */}
                          <td className="border border-gray-300 px-2 py-2 font-semibold">
                            {promedio1S !== null ? convertirCalificacion(promedio1S, Boolean(asignatura.concepto)) : "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 font-semibold">
                            {promedio2S !== null ? convertirCalificacion(promedio2S, Boolean(asignatura.concepto)) : "-"}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 font-semibold">
                            {promedioFinal !== null ? convertirCalificacion(promedioFinal, Boolean(asignatura.concepto)) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Promedios Finales */}
            <div className="w-full max-w-6xl mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Promedio Final 1S</h3>
                  {(() => {
                    // Filtrar asignaturas no conceptuales y calcular sus promedios
                    const promedios1S = libreta.asignaturas
                      .filter(asignatura => !asignatura.concepto)
                      .map(asignatura => {
                        const notas = obtenerNotasSemestre(asignatura, 1, 12);

                        // Usar promedioAnualAsignatura para redondear cada promedio de asignatura
                        return calcularPromedio(notas, configPromedios.promedioAnualAsignatura);
                      })
                      .filter(promedio => promedio !== null) as number[];
                    
                    if (promedios1S.length === 0) return <p className="text-gray-600">No hay notas disponibles</p>;
                    
                    // Sumar los promedios ya redondeados
                    const suma = promedios1S.reduce((acc, val) => acc + val, 0);
                    const promedioFinal = Math.floor(suma / promedios1S.length);

                    return <p className="text-2xl font-bold text-blue-900">{promedioFinal}</p>;
                  })()}
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Promedio Final 2S</h3>
                  {(() => {
                    // Filtrar asignaturas no conceptuales y calcular sus promedios
                    const promedios2S = libreta.asignaturas
                      .filter(asignatura => !asignatura.concepto)
                      .map(asignatura => {
                        const notas = obtenerNotasSemestre(asignatura, 13, 23);

                        // Usar promedioAnualAsignatura para redondear cada promedio de asignatura
                        return calcularPromedio(notas, configPromedios.promedioAnualAsignatura);
                      })
                      .filter(promedio => promedio !== null) as number[];
                    
                    if (promedios2S.length === 0) return <p className="text-gray-600">No hay notas disponibles</p>;
                    
                    // Sumar los promedios ya redondeados
                    const suma = promedios2S.reduce((acc, val) => acc + val, 0);
                    const promedioFinal = Math.floor(suma / promedios2S.length);

                    return <p className="text-2xl font-bold text-green-900">{promedioFinal}</p>;
                  })()}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </DefaultLayout>
  );
}
