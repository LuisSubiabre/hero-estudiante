import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { searchLibreta, promediosCursos } from "@/services/libretaService";
import { Libreta } from "@/types";
import configPromedios from "@/config/configPromedios";
import { useAuth } from "@/context/AuthContext";

// Interfaz para los promedios del curso
interface PromedioCurso {
  asignatura_id: number;
  promedio: string;
  promedio_general: string;
}

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

      const payload = JSON.parse(decoded);

     // console.log("Payload completo:", payload);

      return payload;
    } catch (error) {
    //  console.error("Error al decodificar el token:", error);

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
    padding: 10,
    width: "8.5in",
    height: "11in",
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 3,
  },
  title: {
    fontSize: 14,
    marginTop: 3,
    marginBottom: 1,
    textAlign: "center",
    color: "#1a365d",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 1,
    textAlign: "center",
    color: "#4a5568",
  },
  studentInfo: {
    marginBottom: 5,
    padding: 4,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  infoText: {
    fontSize: 9,
    marginBottom: 1,
  },
  semesterHeader: {
    flexDirection: "row",
    marginBottom: 1,
  },
  semesterBox: {
    flex: 1,
    padding: 1,
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
    marginTop: 3,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 18,
  },
  tableHeader: {
    backgroundColor: "#2c5282",
  },
  tableCell: {
    padding: 1,
    fontSize: 8,
    flex: 1,
    textAlign: "center",
    minWidth: 15,
  },
  headerCell: {
    backgroundColor: "#2c5282",
    color: "#ffffff",
    fontWeight: "bold",
    minWidth: 15,
  },
  subjectCell: {
    flex: 6,
    textAlign: "left",
    minWidth: 100,
  },
  gradeCell: {
    flex: 0.7,
    textAlign: "center",
    minWidth: 15,
  },
  averageCell: {
    backgroundColor: "#f7fafc",
    fontWeight: "bold",
    minWidth: 15,
  },
  finalAverages: {
    marginTop: 5,
    padding: 4,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  averageText: {
    fontSize: 9,
    marginBottom: 1,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 15,
  },
  signatureBox: {
    alignItems: "center",
  },
  signatureLine: {
    fontSize: 9,
    marginBottom: 1,
  },
  signatureName: {
    fontSize: 8,
    color: "#4a5568",
  },
  footer: {
    position: "absolute",
    bottom: 5,
    left: 10,
    right: 10,
    textAlign: "center",
    fontSize: 7,
    color: "#718096",
  },
  chartContainer: {
    marginTop: 5,
    padding: 4,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  chartTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
    color: "#2d3748",
  },
  chart: {
    height: 120,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    position: "relative",
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 1,
    height: "100%",
    position: "relative",
  },
  bar: {
    width: 12,
    backgroundColor: "#2c5282",
    position: "absolute",
    bottom: 20, // Espacio para las etiquetas
    justifyContent: "center",
    alignItems: "center",
  },
  barValue: {
    fontSize: 5,
    textAlign: "center",
    color: "#ffffff",
    position: "absolute",
    bottom: "50%",
  },
  barLabel: {
    fontSize: 6,
    textAlign: "center",
    color: "#4a5568",
    width: 35,
    position: "absolute",
    bottom: 0,
  },
});

// Función para truncar texto
const truncateText = (text: string, maxLength: number = 12) => {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
};

// Componente para el gráfico de barras
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const scale = 100 / maxValue; // Aumentamos la escala para barras más altas

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Gráfico de Rendimiento Promedios Finales por Asignatura</Text>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: item.value * scale,
                },
              ]}
            >
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
            <Text style={styles.barLabel}>{truncateText(item.label)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Componente para el PDF
const NotasPDF = ({ libreta, promediosCurso }: { libreta: Libreta, promediosCurso: PromedioCurso[] }) => {
  const headerRow = [
    "Asignatura",
    ...Array(10).fill("").map((_, i) => `${i + 1}`),
    "1S",
    ...Array(10).fill("").map((_, i) => `${i + 1}`),
    "2S",
    "PF",
    "PC"
  ];

  // Función para obtener el promedio del curso para una asignatura (usada en el PDF)
  const getPromedioCurso = (asignatura_id: number) => {
    const promedio = promediosCurso.find(p => p.asignatura_id === asignatura_id);

    if (promedio) {
      const valor = parseFloat(promedio.promedio_general);
      
      // Encontrar si la asignatura es conceptual
      const asignatura = libreta.asignaturas.find(a => a.asignatura_id === asignatura_id);
      const esConcepto = Boolean(asignatura?.concepto);

      // Aproximar: 59.5 -> 60, 59.4 -> 59
      const redondeado = Math.round(valor * 10) / 10 >= Math.floor(valor) + 0.5
        ? Math.ceil(valor)
        : Math.floor(valor);

      if (esConcepto) {
        // Convertir a concepto
        if (redondeado >= 70) return "MB";
        if (redondeado >= 50) return "B";
        if (redondeado >= 40) return "S";
        if (redondeado >= 30) return "I";

        return redondeado.toString();
      }

      // Si no es conceptual, mantener como número
      return redondeado.toString();
    }

    return "-";
  };

  const getCellStyle = (index: number, totalCells: number) => {
    const cellStyles: any[] = [styles.tableCell];

    if (index === 0) {
      cellStyles.push(styles.subjectCell);
    } else if (index >= totalCells - 3) {
      cellStyles.push(styles.averageCell);
    } else {
      cellStyles.push(styles.gradeCell);
    }

    return cellStyles;
  };

  // Preparar datos para el gráfico
  const chartData = libreta.asignaturas
    .sort((a, b) => a.indice - b.indice)
    .map(asignatura => {
      const notas1S = obtenerNotasSemestre(asignatura, 1, 10);
      const notas2S = obtenerNotasSemestre(asignatura, 13, 22);
      const promedio1S = calcularPromedio(notas1S, configPromedios.promedioAnualAsignatura);
      const promedio2S = calcularPromedio(notas2S, configPromedios.promedioAnualAsignatura);
      const promedioFinal = calcularPromedio(
        [promedio1S, promedio2S].filter(nota => nota !== null) as number[],
        configPromedios.promedioAnualAsignatura
      );

      return {
        label: asignatura.nombre_asignatura,
        value: promedioFinal !== null ? promedioFinal : 0,
      };
    });

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
          {/* Header de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {headerRow.map((header, index) => (
              <Text 
                key={index} 
                style={[
                  styles.tableCell, 
                  styles.headerCell,
                  index === 0 ? styles.subjectCell : styles.gradeCell
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
                convertirCalificacion(promedioFinal, Boolean(asignatura.concepto)),
                getPromedioCurso(asignatura.asignatura_id)
              ];

              return (
                <View key={asignatura.asignatura_id} style={styles.tableRow}>
                  {rowData.map((cell, index) => (
                    <Text 
                      key={index} 
                      style={[
                        styles.tableCell,
                        index === 0 ? styles.subjectCell : styles.gradeCell,
                        index >= rowData.length - 3 ? styles.averageCell : {},
                        index === rowData.length - 1 ? styles.gradeCell : {}
                      ]}
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
        </View>

        {/* Gráfico de Promedios */}
        <BarChart data={chartData} />

        {/* Firmas */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
          <Image
              src="#"
              style={{ width: 120, height: 40 }}
            />
            <Text style={styles.signatureLine}>_______________________</Text>
            <Text style={styles.signatureName}>{libreta.profesor_jefe_nombre}</Text>
            <Text style={styles.signatureName}>Profesor Jefe</Text>
          </View>
          <View style={styles.signatureBox}>
            <Image
              src="https://res.cloudinary.com/dx219dazh/image/upload/v1746451823/varios/zrnowutpg5fgaijjxkpm.png"
              style={{ width: 120, height: 40 }}
            />
            <Text style={styles.signatureLine}>_______________________</Text>
            <Text style={styles.signatureName}>PATRICIO BRAVO JORQUERA</Text>
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
  const { user } = useAuth();
  const [libreta, setLibreta] = useState<Libreta | null>(null);
  const [promediosCurso, setPromediosCurso] = useState<PromedioCurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el promedio del curso para una asignatura (usada en la tabla HTML)
  const getPromedioCurso = (asignatura_id: number) => {
    const promedio = promediosCurso.find(p => p.asignatura_id === asignatura_id);

    if (promedio) {
      const valor = parseFloat(promedio.promedio_general);
      
      // Encontrar si la asignatura es conceptual
      const asignatura = libreta?.asignaturas.find(a => a.asignatura_id === asignatura_id);
      const esConcepto = Boolean(asignatura?.concepto);

      // Aproximar: 59.5 -> 60, 59.4 -> 59
      const redondeado = Math.round(valor * 10) / 10 >= Math.floor(valor) + 0.5
        ? Math.ceil(valor)
        : Math.floor(valor);

      if (esConcepto) {
        // Convertir a concepto
        if (redondeado >= 70) return "MB";
        if (redondeado >= 50) return "B";
        if (redondeado >= 40) return "S";
        if (redondeado >= 30) return "I";

        return redondeado.toString();
      }

      // Si no es conceptual, mantener como número
      return redondeado.toString();
    }

    return "-";
  };

  useEffect(() => {
    const jwt = jwtData();
    const estudiante_id = jwt?.estudiante_id;
    const curso_id = jwt?.curso_id;

    console.log("JWT completo:", jwt);
    console.log("curso_id:", curso_id);
    
    if (!estudiante_id) {
      setError("No se encontró el ID del estudiante");
      setLoading(false);

      return;
    }

    // Obtener promedios del curso
    if (curso_id) {
      promediosCursos(curso_id)
        .then((promediosData) => {
          console.log("Promedios del curso:", promediosData);
          setPromediosCurso(promediosData);
        })
        .catch((error) => {
          console.error("Error al obtener promedios del curso:", error);
        });
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
          {/* {!loading && libreta && (
            <PDFDownloadLink
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              document={<NotasPDF libreta={libreta} promediosCurso={promediosCurso} />}
              fileName={`notas_${libreta.nombre_estudiante}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Generando PDF..." : "Descargar PDF"
              }
            </PDFDownloadLink>
          )} */}
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
                    <th className="border border-gray-300 px-4 py-2 bg-gray-200" rowSpan={2}>
                      PC
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
                        {i + 1}
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
                          <td className="border border-gray-300 px-2 py-2 font-semibold">
                            {getPromedioCurso(asignatura.asignatura_id)}
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
