import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { ClockIcon } from '@/components/icons';
import { UserIcon, MapPinIcon } from 'lucide-react';
// import { AsignaturaEncuesta } from '@/types'; // Comentado temporalmente

interface AsignaturaCardProps {
  asignatura: any; // Usando any temporalmente
  onInscribir: (asignatura_encuesta_id: number) => void;
  onDesinscribir: (asignatura_encuesta_id: number) => void;
  isInscrito: boolean;
  isLoading?: boolean;
}

const AsignaturaCard: React.FC<AsignaturaCardProps> = ({
  asignatura,
  onInscribir,
  onDesinscribir,
  isInscrito,
  isLoading = false
}) => {
  const cuposDisponibles = asignatura.cupos_actuales || asignatura.cupos_disponibles || asignatura.cupos || 0;
  const cuposTotales = asignatura.cupos_totales || asignatura.cupos || 0;
  const porcentajeOcupacion = cuposTotales > 0 ? ((cuposTotales - cuposDisponibles) / cuposTotales) * 100 : 0;

  const getCuposColor = () => {
    if (cuposDisponibles === 0) return 'danger';
    if (porcentajeOcupacion > 80) return 'warning';
    return 'success';
  };

  const handleAction = () => {
    const id = asignatura.asignatura_encuesta_id || asignatura.id || asignatura.asignatura_id;
    if (isInscrito) {
      onDesinscribir(id);
    } else {
      onInscribir(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <p className="text-md font-semibold">{asignatura.nombre}</p>
            <Chip 
              color={getCuposColor()} 
              variant="flat" 
              size="sm"
            >
              {cuposDisponibles}/{cuposTotales} cupos
            </Chip>
          </div>
          <p className="text-small text-default-500">
            {asignatura.bloque || 'Sin bloque'} • {asignatura.area || 'Sin área'}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {asignatura.descripcion && (
            <p className="text-small text-default-700">
              {asignatura.descripcion}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-small">
            {asignatura.profesor && (
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-default-400" />
                <span className="text-default-600">Prof: {asignatura.profesor}</span>
              </div>
            )}
            
            {asignatura.horario && (
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-default-400" />
                <span className="text-default-600">{asignatura.horario}</span>
              </div>
            )}
            
            {asignatura.ubicacion && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-default-400" />
                <span className="text-default-600">{asignatura.ubicacion}</span>
              </div>
            )}
          </div>

          {asignatura.requisitos && (
            <div className="bg-warning-50 dark:bg-warning-900/20 p-3 rounded-lg">
              <p className="text-small font-medium text-warning-700 dark:text-warning-300 mb-1">
                Requisitos:
              </p>
              <p className="text-small text-warning-600 dark:text-warning-400">
                {asignatura.requisitos}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              color={isInscrito ? "danger" : "primary"}
              variant={isInscrito ? "flat" : "solid"}
              size="sm"
              onPress={handleAction}
              isLoading={isLoading}
              isDisabled={asignatura.estado !== 'visible' || (!isInscrito && cuposDisponibles === 0)}
            >
              {isInscrito ? 'Desinscribir' : 'Inscribir'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AsignaturaCard;
