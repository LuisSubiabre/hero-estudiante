import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner } from "@heroui/react";

import { getAsistencia } from "../services/asistenciaService";

import { useAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";

interface AsistenciaData {
  mes: number;
  anio: number;
  total_dias: number;
  dias_asistidos: number;
  porcentaje_asistencia: string;
  fecha_registro: string;
}

const Asistencia = () => {
  const [asistencia, setAsistencia] = useState<AsistenciaData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAsistencia = async () => {
      try {
        const response = await getAsistencia(parseInt(user.user_id));

        if (response.success) {
          // Ordenar los datos por año y mes de manera ascendente
          const datosOrdenados = response.data.sort((a: AsistenciaData, b: AsistenciaData) => {
            if (a.anio !== b.anio) {
              return a.anio - b.anio; // Ordenar por año ascendente
            }

            return a.mes - b.mes; // Si el año es igual, ordenar por mes ascendente
          });

          setAsistencia(datosOrdenados);
        }
      } catch (error) {
        console.error("Error al obtener la asistencia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencia();
  }, [user.user_id]);

  const getNombreMes = (mes: number) => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return meses[mes - 1];
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Registro de Asistencia</h2>
        <Table aria-label="Tabla de asistencia">
          <TableHeader>
            <TableColumn>MES</TableColumn>
            <TableColumn>AÑO</TableColumn>
            <TableColumn>TOTAL DÍAS CLASE</TableColumn>
            <TableColumn>DÍAS ASISTIDOS</TableColumn>
            <TableColumn>PORCENTAJE</TableColumn>
          </TableHeader>
          <TableBody>
            {asistencia.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{getNombreMes(item.mes)}</TableCell>
                <TableCell>{item.anio}</TableCell>
                <TableCell>{item.total_dias}</TableCell>
                <TableCell>{item.dias_asistidos}</TableCell>
                <TableCell>{item.porcentaje_asistencia}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DefaultLayout>
  );
};

export default Asistencia; 