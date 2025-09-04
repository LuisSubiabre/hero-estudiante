import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { BookOpenIcon } from '@/components/icons';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { ResumenElecciones } from '@/types';

interface EleccionesEstudianteProps {
  resumen: ResumenElecciones;
  onDesinscribir: (asignatura_encuesta_id: number) => void;
  isLoading?: boolean;
}

const EleccionesEstudiante: React.FC<EleccionesEstudianteProps> = ({
  resumen,
  onDesinscribir,
  isLoading = false
}) => {
  const eleccionesActivas = resumen.elecciones.filter(e => e.estado === 'activa');

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <UserIcon className="w-6 h-6 text-primary" />
        <div className="flex flex-col flex-1">
          <p className="text-lg font-semibold">Mis Elecciones</p>
          <p className="text-small text-default-500">
            {resumen.estudiante.nombre} • {resumen.estudiante.curso}
          </p>
        </div>
        <div className="flex gap-2">
          <Chip color="success" variant="flat" size="sm">
            {resumen.elecciones_activas} activas
          </Chip>
          <Chip color="default" variant="flat" size="sm">
            {resumen.total_elecciones} total
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        {eleccionesActivas.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-default-300" />
            <p className="text-lg font-medium mb-2">No tienes asignaturas inscritas</p>
            <p className="text-small">
              Explora las asignaturas disponibles y haz tu elección
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {eleccionesActivas.map((eleccion) => (
              <div
                key={eleccion.asignatura_encuesta_id}
                className="flex items-center justify-between p-4 bg-default-50 dark:bg-default-100 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {eleccion.nombre_asignatura}
                    </h4>
                    <Chip color="primary" variant="flat" size="sm">
                      {eleccion.bloque}
                    </Chip>
                    <Chip color="secondary" variant="flat" size="sm">
                      {eleccion.area}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 text-small text-default-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Inscrito el {formatFecha(eleccion.fecha_inscripcion)}</span>
                  </div>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => onDesinscribir(eleccion.asignatura_encuesta_id)}
                  isLoading={isLoading}
                >
                  Desinscribir
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default EleccionesEstudiante;
