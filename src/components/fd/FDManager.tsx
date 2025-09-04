import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Spinner, Button } from '@heroui/react';
import { UserIcon, RefreshCwIcon } from 'lucide-react';

import BloqueAsignaturas from './BloqueAsignaturas';

import { BookOpenIcon } from '@/components/icons';
import { getAllAsignaturas, inscribirAsignatura, desinscribirAsignatura } from '@/services/fdService';


const FDManager: React.FC = () => {
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [bloques, setBloques] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('bloques');

  const eleccionesEstudiante: number[] = []; // Por ahora vacío hasta implementar elecciones

  const loadData = async () => {
    try {
      console.log('🚀 Iniciando carga de datos...');
      setIsLoading(true);
      setError(null);

      const asignaturasData = await getAllAsignaturas();

      console.log('📊 Datos recibidos:', asignaturasData);

      setAsignaturas(asignaturasData);
      
      // Organizar por bloques de manera simple
      const bloquesMap = new Map();

      asignaturasData.forEach((asignatura: any) => {
        const bloque = asignatura.bloque || 'Sin Bloque';

        if (!bloquesMap.has(bloque)) {
          bloquesMap.set(bloque, []);
        }
        bloquesMap.get(bloque).push(asignatura);
      });

      const bloquesOrganizados = Array.from(bloquesMap.entries()).map(([nombre, asignaturas]) => ({
        nombre,
        descripcion: `Bloque ${nombre}`,
        asignaturas
      }));

      console.log('🏗️ Bloques organizados:', bloquesOrganizados);
      setBloques(bloquesOrganizados);
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInscribir = async (asignatura_encuesta_id: number) => {
    try {
      setIsLoading(true);
      await inscribirAsignatura(asignatura_encuesta_id, 1); // Prioridad 1 por defecto
      
      // Recargar datos después de la inscripción
      await loadData();
      
      // Mostrar mensaje de éxito
      alert('¡Inscripción exitosa!');
    } catch (err) {
      console.error('Error al inscribir:', err);
      alert('Error al inscribir en la asignatura. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesinscribir = async (asignatura_encuesta_id: number) => {
    try {
      setIsLoading(true);
      await desinscribirAsignatura(asignatura_encuesta_id);
      
      // Recargar datos después de la desinscripción
      await loadData();
      
      // Mostrar mensaje de éxito
      alert('¡Desinscripción exitosa!');
    } catch (err) {
      console.error('Error al desinscribir:', err);
      alert('Error al desinscribir de la asignatura. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  console.log('🎨 Renderizando FDManager:', {
    isLoading,
    error,
    bloques: bloques.length,
    asignaturas: asignaturas.length
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner label="Cargando asignaturas..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <p className="text-danger mb-4">{error}</p>
          <Button color="primary" onPress={loadData}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - Temporal */}
      <Card className="bg-warning-50 dark:bg-warning-900/20">
        <CardHeader>
          <p className="text-sm font-semibold text-warning-700 dark:text-warning-300">
            🔍 Debug Info (Temporal)
          </p>
        </CardHeader>
        <CardBody>
          <div className="text-xs text-warning-600 dark:text-warning-400 space-y-1">
            <p>• Asignaturas cargadas: {asignaturas.length}</p>
            <p>• Bloques organizados: {bloques.length}</p>
            <p>• Elecciones estudiante: {eleccionesEstudiante.length}</p>
            <p>• URL Base: {import.meta.env.VITE_URL_BASE || 'No configurada'}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <BookOpenIcon className="w-6 h-6 text-primary" />
          <div className="flex flex-col flex-1">
            <p className="text-xl font-semibold">Formación Diferenciada</p>
            <p className="text-small text-default-500">
              Elige tus asignaturas para el próximo período académico
            </p>
            
            {/* Leyenda de colores */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <span className="text-xs text-default-600">Área A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-xs text-default-600">Área B</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-500" />
                <span className="text-xs text-default-600">Área C</span>
              </div>
            </div>
          </div>
          <Button
            color="primary"
            isLoading={isLoading}
            size="sm"
            variant="flat"
            onPress={loadData}
          >
            <RefreshCwIcon className="w-4 h-4" />
            Actualizar
          </Button>
        </CardHeader>
      </Card>

      <Tabs
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
        color="primary"
        selectedKey={selectedTab}
        variant="underlined"
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab
          key="bloques"
          title={
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="w-4 h-4" />
              <span>Asignaturas por Bloques</span>
            </div>
          }
        >
          <div className="space-y-6">
            {bloques.map((bloque) => (
              <BloqueAsignaturas
                key={bloque.nombre}
                bloque={bloque}
                eleccionesEstudiante={eleccionesEstudiante}
                isLoading={false}
                onDesinscribir={handleDesinscribir}
                onInscribir={handleInscribir}
              />
            ))}
          </div>
        </Tab>

        <Tab
          key="elecciones"
          title={
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>Mis Elecciones</span>
            </div>
          }
        >
          <Card>
            <CardBody className="text-center py-12">
              <UserIcon className="w-12 h-12 mx-auto mb-4 text-default-300" />
              <p className="text-lg font-medium mb-2">Funcionalidad en desarrollo</p>
              <p className="text-small text-default-500">
                La gestión de elecciones estará disponible próximamente
              </p>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default FDManager;
