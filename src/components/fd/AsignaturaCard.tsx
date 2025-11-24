import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { ClockIcon } from '@/components/icons';
import { UserIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
// import { AsignaturaEncuesta } from '@/types'; // Comentado temporalmente

interface AsignaturaCardProps {
  asignatura: any; // Usando any temporalmente
  onInscribir: (asignatura_encuesta_id: number) => void;
  onDesinscribir: (asignatura_encuesta_id: number) => void;
  isInscrito: boolean;
  isLoading?: boolean;
  maxEleccionesAlcanzado?: boolean;
  isBloqueada?: boolean;
}

const AsignaturaCard: React.FC<AsignaturaCardProps> = ({
  asignatura,
  onInscribir,
  onDesinscribir,
  isInscrito,
  isLoading = false,
  maxEleccionesAlcanzado = false,
  isBloqueada = false
}) => {
  const cuposDisponibles = asignatura.cupos_actuales || asignatura.cupos_disponibles || asignatura.cupos || 0;
  const cuposTotales = asignatura.cupos_totales || asignatura.cupos || 0;
  const porcentajeOcupacion = cuposTotales > 0 ? ((cuposTotales - cuposDisponibles) / cuposTotales) * 100 : 0;

  const getCuposColor = () => {
    if (cuposDisponibles === 0) return 'danger';
    if (porcentajeOcupacion > 80) return 'warning';
    return 'success';
  };

  const getAreaColor = () => {
    const area = asignatura.area?.toUpperCase();
    switch (area) {
      case 'A':
        return 'warning'; // Naranja
      case 'B':
        return 'primary'; // Azul
      case 'C':
        return 'secondary'; // Púrpura
      default:
        return 'default';
    }
  };

  const getAreaColorClasses = () => {
    const area = asignatura.area?.toUpperCase();
    switch (area) {
      case 'A':
        return {
          border: 'border-warning-200 dark:border-warning-800',
          bg: 'bg-warning-50 dark:bg-warning-900/20',
          text: 'text-warning-700 dark:text-warning-300'
        };
      case 'B':
        return {
          border: 'border-primary-200 dark:border-primary-800',
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          text: 'text-primary-700 dark:text-primary-300'
        };
      case 'C':
        return {
          border: 'border-secondary-200 dark:border-secondary-800',
          bg: 'bg-secondary-50 dark:bg-secondary-900/20',
          text: 'text-secondary-700 dark:text-secondary-300'
        };
      default:
        return {
          border: 'border-default-200 dark:border-default-800',
          bg: 'bg-default-50 dark:bg-default-900/20',
          text: 'text-default-700 dark:text-default-300'
        };
    }
  };

  const handleAction = () => {
    const id = asignatura.asignatura_encuesta_id || asignatura.id || asignatura.asignatura_id;
    if (isInscrito) {
      onDesinscribir(id);
    } else {
      onInscribir(id);
    }
  };

  const areaColors = getAreaColorClasses();

  return (
    <Card className={`w-full ${areaColors.border} ${areaColors.bg}`}>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <p className="text-md font-semibold">{asignatura.nombre}</p>
            <Chip 
              color={getCuposColor()} 
              variant="flat" 
              size="sm"
            >
              {cuposDisponibles} cupos disponibles
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-small text-default-500">
              {asignatura.bloque || 'Sin bloque'}
            </p>
            <Chip 
              color={getAreaColor()} 
              variant="flat" 
              size="sm"
              className="font-medium"
            >
              Área {asignatura.area || '?'}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {asignatura.descripcion && (
            <p className="text-small text-default-700">
              {asignatura.descripcion}
            </p>
          )}

          {/* Información de horario destacada */}
          {(asignatura.dia || asignatura.horario) && (
            <div className={`${areaColors.bg} ${areaColors.border} border rounded-lg p-3 mb-3`}>
              <div className="flex items-center gap-4">
                {asignatura.dia && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className={`w-4 h-4 ${areaColors.text}`} />
                    <span className={`text-sm font-semibold ${areaColors.text}`}>
                      {asignatura.dia}
                    </span>
                  </div>
                )}
                {asignatura.horario && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className={`w-4 h-4 ${areaColors.text}`} />
                    <span className={`text-sm font-semibold ${areaColors.text}`}>
                      {asignatura.horario}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-small">
            {asignatura.profesor && (
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-default-400" />
                <span className="text-default-600">Prof: {asignatura.profesor}</span>
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
            {/* Mostrar botón solo si está inscrito o si no se ha alcanzado el límite */}
            {isInscrito || !maxEleccionesAlcanzado ? (
              <>
                <Button
                  color={isInscrito ? "danger" : "primary"}
                  variant={isInscrito ? "flat" : "solid"}
                  size="sm"
                  onPress={handleAction}
                  isLoading={isLoading}
                  isDisabled={
                    asignatura.estado !== 'visible' || 
                    (!isInscrito && cuposDisponibles === 0) ||
                    (!isInscrito && isBloqueada)
                  }
                >
                  {isInscrito ? 'Desinscribir' : 'Inscribir'}
                </Button>
                {!isInscrito && isBloqueada && (
                  <p className="text-xs text-default-500 mt-2 text-center w-full">
                    Ya tienes una asignatura seleccionada en este bloque
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs text-default-500">
                  Límite de 3 asignaturas alcanzado
                </p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AsignaturaCard;
