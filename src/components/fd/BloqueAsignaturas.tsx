import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';

import AsignaturaCard from './AsignaturaCard';

import { BookOpenIcon } from '@/components/icons';
// import { BloqueFD } from '@/types'; // Comentado temporalmente

interface BloqueAsignaturasProps {
  bloque: any; // Usando any temporalmente
  eleccionesEstudiante: number[];
  onInscribir: (asignatura_encuesta_id: number) => void;
  onDesinscribir: (asignatura_encuesta_id: number) => void;
  isLoading?: boolean;
  maxEleccionesAlcanzado?: boolean;
}

const BloqueAsignaturas: React.FC<BloqueAsignaturasProps> = ({
  bloque,
  eleccionesEstudiante,
  onInscribir,
  onDesinscribir,
  isLoading = false,
  maxEleccionesAlcanzado = false
}) => {

  // Obtener el color del área más común en este bloque
  const getBloqueColor = () => {
    const areas = bloque.asignaturas.map((a: any) => a.area?.toUpperCase()).filter(Boolean);
    const areaCounts = areas.reduce((acc: any, area: string) => {
      acc[area] = (acc[area] || 0) + 1;

      return acc;
    }, {});
    
    const mostCommonArea = Object.keys(areaCounts).reduce((a, b) => 
      areaCounts[a] > areaCounts[b] ? a : b, 'A'
    );
    
    switch (mostCommonArea) {
      case 'A':
        return 'warning';
      case 'B':
        return 'primary';
      case 'C':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const asignaturasActivas = bloque.asignaturas.filter((a: any) => a.estado === 'visible' || a.activa);
  const cuposDisponibles = asignaturasActivas.reduce((sum: number, a: any) => sum + (a.cupos_actuales || a.cupos_disponibles || 0), 0);


  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <BookOpenIcon className={`w-6 h-6 text-${getBloqueColor()}`} />
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
            {cuposDisponibles} cupos disponibles
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
                isInscrito={eleccionesEstudiante.includes(asignatura.asignatura_encuesta_id)}
                isLoading={isLoading}
                maxEleccionesAlcanzado={maxEleccionesAlcanzado}
                onDesinscribir={onDesinscribir}
                onInscribir={onInscribir}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BloqueAsignaturas;
