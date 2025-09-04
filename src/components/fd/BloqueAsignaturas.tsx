import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { BookOpenIcon } from '@/components/icons';
// import { BloqueFD } from '@/types'; // Comentado temporalmente
import AsignaturaCard from './AsignaturaCard';

interface BloqueAsignaturasProps {
  bloque: any; // Usando any temporalmente
  eleccionesEstudiante: number[];
  onInscribir: (asignatura_encuesta_id: number) => void;
  onDesinscribir: (asignatura_encuesta_id: number) => void;
  isLoading?: boolean;
}

const BloqueAsignaturas: React.FC<BloqueAsignaturasProps> = ({
  bloque,
  eleccionesEstudiante,
  onInscribir,
  onDesinscribir,
  isLoading = false
}) => {
  console.log('🏗️ Renderizando BloqueAsignaturas:', {
    bloque: bloque.nombre,
    totalAsignaturas: bloque.asignaturas.length,
    asignaturas: bloque.asignaturas
  });

  const asignaturasActivas = bloque.asignaturas.filter((a: any) => a.estado === 'visible' || a.activa);
  const totalCupos = asignaturasActivas.reduce((sum: number, a: any) => sum + (a.cupos_totales || 0), 0);
  const cuposDisponibles = asignaturasActivas.reduce((sum: number, a: any) => sum + (a.cupos_actuales || a.cupos_disponibles || 0), 0);

  console.log('📊 Estadísticas del bloque:', {
    asignaturasActivas: asignaturasActivas.length,
    totalCupos,
    cuposDisponibles
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <BookOpenIcon className="w-6 h-6 text-primary" />
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{bloque.nombre}</p>
            <div className="text-small text-default-500">
              {asignaturasActivas.length} asignatura{asignaturasActivas.length !== 1 ? 's' : ''}
            </div>
          </div>
          {bloque.descripcion && (
            <p className="text-small text-default-500">{bloque.descripcion}</p>
          )}
          <div className="text-small text-default-400">
            Cupos: {cuposDisponibles}/{totalCupos} disponibles
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {asignaturasActivas.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-default-300" />
            <p>No hay asignaturas disponibles en este bloque</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {asignaturasActivas.map((asignatura: any) => (
              <AsignaturaCard
                key={asignatura.asignatura_encuesta_id}
                asignatura={asignatura}
                onInscribir={onInscribir}
                onDesinscribir={onDesinscribir}
                isInscrito={eleccionesEstudiante.includes(asignatura.asignatura_encuesta_id)}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BloqueAsignaturas;
