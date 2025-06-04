import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

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

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
    color: "#1a365d",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "center",
    color: "#4a5568",
  },
  studentInfo: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  infoText: {
    fontSize: 9,
    marginBottom: 2,
  },
  semesterHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  semesterBox: {
    flex: 1,
    padding: 4,
    alignItems: "center",
  },
  firstSemester: {
    backgroundColor: "#ebf8ff",
  },
  secondSemester: {
    backgroundColor: "#f0fff4",
  },
  semesterText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#2d3748",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 20,
  },
  tableHeader: {
    backgroundColor: "#2c5282",
  },
  tableCell: {
    padding: 4,
    fontSize: 7,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flex: 1,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: "#2c5282",
    color: "#ffffff",
    fontWeight: "bold",
  },
  subjectCell: {
    flex: 4,
    textAlign: "left",
  },
  averageCell: {
    backgroundColor: "#f7fafc",
    fontWeight: "bold",
  },
  finalAverages: {
    marginTop: 15,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  averageText: {
    fontSize: 9,
    marginBottom: 2,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 30,
  },
  signatureBox: {
    alignItems: "center",
  },
  signatureLine: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 8,
    color: "#4a5568",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 7,
    color: "#718096",
  },
});

// Componente para el PDF
const NotasPDF = ({ libreta }: { libreta: Libreta }) => {
  const headerRow = [
    "Asignatura",
    ...Array(10).fill("").map((_, i) => `${i + 1}`),
    "1S",
    ...Array(10).fill("").map((_, i) => `${i + 13}`),
    "2S",
    "PF",
  ];

  const getCellStyle = (index: number, totalCells: number) => {
    const cellStyles: any[] = [styles.tableCell];

    if (index === 0) cellStyles.push(styles.subjectCell);
    if (index >= totalCells - 3) cellStyles.push(styles.averageCell);

    return cellStyles;
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Logo y Encabezado */}
        <View style={styles.header}>
          <Image
            src="/images/logo_fondo_blanco.png"
            style={{ width: 120, height: 32 }}
          />
          <Text style={styles.title}>Informe Parcial de Calificaciones</Text>
          <Text style={styles.subtitle}>Liceo Experimental UMAG</Text>
        </View>

        {/* Información del Estudiante */}
        <View style={styles.studentInfo}>
          <Text style={styles.infoText}>Estudiante: {libreta.nombre_estudiante}</Text>
          <Text style={styles.infoText}>Curso: {libreta.curso_nombre}</Text>
        </View>

        {/* Tabla de Notas */}
        <View style={styles.table}>
          {/* Encabezados de Semestre */}
          <View style={styles.semesterHeader}>
            <View style={[styles.semesterBox, styles.firstSemester]}>
              <Text style={styles.semesterText}>1er Semestre</Text>
            </View>
            <View style={[styles.semesterBox, styles.secondSemester]}>
              <Text style={styles.semesterText}>2do Semestre</Text>
            </View>
          </View>

          {/* Header de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {headerRow.map((header, index) => (
              <Text 
                key={index} 
                style={[
                  styles.tableCell, 
                  styles.headerCell,
                  index === 0 ? styles.subjectCell : {}
                ]}
              >
                {header}
              </Text>
            ))}
          </View>

          {/* Body de la tabla */}
          {libreta.asignaturas
            .sort((a, b) => a.indice - b.indice)
            .map((asignatura) => {
              const notas1S = obtenerNotasSemestre(asignatura, 1, 10);
              const notas2S = obtenerNotasSemestre(asignatura, 13, 22);
              const promedio1S = calcularPromedio(notas1S, configPromedios.promedioAnualAsignatura);
              const promedio2S = calcularPromedio(notas2S, configPromedios.promedioAnualAsignatura);
              const promedioFinal = calcularPromedio(
                [promedio1S, promedio2S].filter(nota => nota !== null) as number[],
                configPromedios.promedioAnualAsignatura
              );

              const rowData = [
                asignatura.nombre_asignatura,
                ...notas1S.map(n => convertirCalificacion(n, Boolean(asignatura.concepto))),
                convertirCalificacion(promedio1S, Boolean(asignatura.concepto)),
                ...notas2S.map(n => convertirCalificacion(n, Boolean(asignatura.concepto))),
                convertirCalificacion(promedio2S, Boolean(asignatura.concepto)),
                convertirCalificacion(promedioFinal, Boolean(asignatura.concepto))
              ];

              return (
                <View key={asignatura.asignatura_id} style={styles.tableRow}>
                  {rowData.map((cell, index) => (
                    <Text 
                      key={index} 
                      style={getCellStyle(index, rowData.length)}
                    >
                      {cell}
                    </Text>
                  ))}
                </View>
              );
            })}
        </View>

        {/* Promedios Finales */}
        <View style={styles.finalAverages}>
          <Text style={styles.averageText}>
            Promedio General 1° Semestre: {calcularPromedioGeneral(libreta, 1)}
          </Text>
          <Text style={styles.averageText}>
            Promedio General 2° Semestre: {calcularPromedioGeneral(libreta, 2)}
          </Text>
          <Text style={styles.averageText}>
            {/* Promedio General Final: {calcularPromedioGeneral(libreta, 3)} */}
          </Text>
        </View>

        {/* Firmas */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>_______________________</Text>
            <Text style={styles.signatureName}>Profesor Jefe</Text>
          </View>
          <View style={styles.signatureBox}>
            <Image
              src="/images/pbravo-signature.png"
              style={{ width: 120, height: 40 }}
            />
            <Text style={styles.signatureName}>Director</Text>
          </View>
        </View>

        {/* Pie de página */}
        <Text style={styles.footer}>
          Documento generado el {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

// Función para calcular el promedio general
const calcularPromedioGeneral = (libreta: Libreta, tipo: number): string => {
  const asignaturas = libreta.asignaturas.filter(a => !a.concepto);
  
  if (asignaturas.length === 0) return "-";

  const promedios = asignaturas.map(asignatura => {
    if (tipo === 1) {
      const notas = obtenerNotasSemestre(asignatura, 1, 10);
      const promedio = calcularPromedio(notas, configPromedios.promedioAnualAsignatura);

      return promedio !== null ? promedio : null;
    } else if (tipo === 2) {
      const notas = obtenerNotasSemestre(asignatura, 13, 22);
      const promedio = calcularPromedio(notas, configPromedios.promedioAnualAsignatura);

      return promedio !== null ? promedio : null;
    } else {
      const notas1S = obtenerNotasSemestre(asignatura, 1, 10);
      const notas2S = obtenerNotasSemestre(asignatura, 13, 22);
      const promedio1S = calcularPromedio(notas1S, configPromedios.promedioAnualAsignatura);
      const promedio2S = calcularPromedio(notas2S, configPromedios.promedioAnualAsignatura);
      const promediosSemestres = [promedio1S, promedio2S].filter((nota): nota is number => nota !== null);

      return promediosSemestres.length > 0 ? 
        calcularPromedio(promediosSemestres, configPromedios.promedioAnualAsignatura) : 
        null;
    }
  });

  const promediosNumericos = promedios
    .filter((p): p is number => p !== null)
    .map(p => typeof p === 'string' ? parseFloat(p) : p)
    .filter((p): p is number => !isNaN(p));

  if (promediosNumericos.length === 0) return "-";

  const promedioFinal = promediosNumericos.reduce((a, b) => a + b, 0) / promediosNumericos.length;

  return Math.floor(promedioFinal).toString();
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
          {!loading && libreta && (
            <PDFDownloadLink
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              document={<NotasPDF libreta={libreta} />}
              fileName={`notas_${libreta.nombre_estudiante}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Generando PDF..." : "Descargar PDF"
              }
            </PDFDownloadLink>
          )}
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
                      colSpan={10}
                    >
                      Primer Semestre
                    </th>
                    <th
                      className="border border-gray-300 px-4 py-2 bg-green-100"
                      colSpan={10}
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
                    {[...Array(10)].map((_, i) => (
                      <th key={i} className="border border-gray-300 px-2 py-2">
                        {i + 1}
                      </th>
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <th
                        key={i + 10}
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
                      const notas1S = obtenerNotasSemestre(asignatura, 1, 10);
                      const notas2S = obtenerNotasSemestre(asignatura, 13, 22);
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
                          {[...Array(10)].map((_, i) => (
                            <td
                              key={i}
                              className="border border-gray-300 px-2 py-2"
                            >
                              {convertirCalificacion(asignatura[`calificacion${i + 1}`] as number | null, Boolean(asignatura.concepto))}
                            </td>
                          ))}
                          {/* Segundo Semestre */}
                          {[...Array(10)].map((_, i) => (
                            <td
                              key={i + 10}
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
                        const notas = obtenerNotasSemestre(asignatura, 1, 10);

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
                        const notas = obtenerNotasSemestre(asignatura, 13, 22);

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
