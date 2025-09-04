import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Spinner, Button } from '@heroui/react';
import { UserIcon, RefreshCwIcon } from 'lucide-react';

import BloqueAsignaturas from './BloqueAsignaturas';
import EleccionesEstudiante from './EleccionesEstudiante';

import ToastContainer from '@/components/ToastContainer';
import { BookOpenIcon } from '@/components/icons';
import { getAllAsignaturas, inscribirAsignatura, desinscribirAsignatura, listarAsignaturasInscritas } from '@/services/fdService';
import { ResumenElecciones } from '@/types';
import { useToast } from '@/hooks/useToast';


const FDManager: React.FC = () => {
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [bloques, setBloques] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('bloques');
  const [eleccionesEstudiante, setEleccionesEstudiante] = useState<number[]>([]);
  const [resumenElecciones, setResumenElecciones] = useState<ResumenElecciones | null>(null);
  const [isLoadingElecciones, setIsLoadingElecciones] = useState(false);
  
  const { toasts, removeToast, success, error: showError, warning } = useToast();

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
      
      // Cargar elecciones del estudiante
      await loadElecciones();
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadElecciones = async () => {
    try {
      console.log('🎯 Cargando elecciones del estudiante...');
      setIsLoadingElecciones(true);
      
      const eleccionesData = await listarAsignaturasInscritas();
      
      console.log('📋 Elecciones recibidas:', eleccionesData);
      console.log('📋 Tipo de datos:', typeof eleccionesData, Array.isArray(eleccionesData));
      console.log('📋 Cantidad de elecciones:', eleccionesData?.length);
      
      // Verificar que tenemos datos
      if (!eleccionesData || !Array.isArray(eleccionesData)) {
        console.warn('⚠️ No hay elecciones o formato incorrecto');
        setResumenElecciones(null);
        setEleccionesEstudiante([]);

        return;
      }
      
      // Transformar datos al formato esperado por EleccionesEstudiante
      const eleccionesTransformadas = eleccionesData.map((eleccion: any) => {
        console.log('🔄 Transformando elección:', eleccion);

        return {
          asignatura_encuesta_id: eleccion.asignatura_encuesta_id,
          nombre_asignatura: eleccion.asignaturas_encuestum?.nombre || 'Sin nombre',
          bloque: eleccion.asignaturas_encuestum?.bloque || 'Sin bloque',
          area: eleccion.asignaturas_encuestum?.area || 'Sin área',
          fecha_inscripcion: eleccion.fecha_creacion,
          estado: 'activa' as const
        };
      });
      
      console.log('🔄 Elecciones transformadas:', eleccionesTransformadas);
      
      // Crear resumen de elecciones
      const resumen: ResumenElecciones = {
        estudiante: {
          nombre: 'Estudiante', // TODO: Obtener del contexto de autenticación
          rut: '12345678-9', // TODO: Obtener del contexto de autenticación
          curso: '4° Medio' // TODO: Obtener del contexto de autenticación
        },
        elecciones: eleccionesTransformadas,
        elecciones_activas: eleccionesTransformadas.filter((e: any) => e.estado === 'activa').length,
        total_elecciones: eleccionesTransformadas.length
      };
      
      setResumenElecciones(resumen);
      setEleccionesEstudiante(eleccionesData.map((e: any) => e.asignatura_encuesta_id));
      
      console.log('✅ Elecciones procesadas:', resumen);
      console.log('✅ Estado actualizado - resumenElecciones:', resumen);
    } catch (err) {
      console.error('❌ Error al cargar elecciones:', err);
      console.error('❌ Detalles del error:', err);
      setResumenElecciones(null);
      setEleccionesEstudiante([]);
    } finally {
      setIsLoadingElecciones(false);
    }
  };

  const handleInscribir = async (asignatura_encuesta_id: number) => {
    try {
      // Validación básica del frontend (pero permitir que el backend tenga la última palabra)
      const eleccionesActivas = resumenElecciones?.elecciones_activas || 0;

      if (eleccionesActivas >= 3) {
        console.log('⚠️ Frontend detecta 3+ asignaturas, pero permitiendo que el backend valide');
      }

      // Verificar si ya está inscrito en esta asignatura
      if (eleccionesEstudiante.includes(asignatura_encuesta_id)) {
        warning('Asignatura duplicada', 'Ya estás inscrito en esta asignatura.');

        return;
      }

      // Buscar la asignatura para obtener su área y determinar la prioridad
      const asignatura = asignaturas.find(a => a.asignatura_encuesta_id === asignatura_encuesta_id);

      if (!asignatura) {
        showError('Error', 'No se pudo encontrar la información de la asignatura.');

        return;
      }

      // Determinar prioridad basada en el área
      let prioridad = 1; // Por defecto

      switch (asignatura.area?.toUpperCase()) {
        case 'A':
          prioridad = 1;
          break;
        case 'B':
          prioridad = 2;
          break;
        case 'C':
          prioridad = 3;
          break;
        default:
          console.warn('⚠️ Área desconocida:', asignatura.area, 'usando prioridad 1');
          prioridad = 1;
      }

      console.log(`📝 Inscribiendo en asignatura ${asignatura_encuesta_id} (${asignatura.nombre})`);
      console.log(`📊 Área: ${asignatura.area} → Prioridad: ${prioridad}`);
      console.log(`📈 Elecciones actuales: ${eleccionesActivas}/3`);
      
      setIsLoading(true);
      await inscribirAsignatura(asignatura_encuesta_id, prioridad);
      
      // Recargar datos después de la inscripción
      await loadData();
      
      // Mostrar mensaje de éxito
      success(
        '¡Inscripción exitosa!',
        `${asignatura.nombre} (Área ${asignatura.area}, Prioridad ${prioridad})`
      );
    } catch (err: any) {
      console.error('Error al inscribir:', err);
      
      // Mostrar detalles del error si están disponibles
      let errorTitle = 'Error al inscribir';
      let errorMessage = 'No se pudo completar la inscripción.';
      
      if (err.response?.data?.message) {
        // Mostrar el mensaje específico del servidor
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'La petición no es válida. Verifica que no estés intentando inscribirte en una asignatura duplicada.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Conflicto. Es posible que ya estés inscrito en esta asignatura.';
      }
      
      showError(errorTitle, errorMessage);
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
      success('¡Desinscripción exitosa!', 'Te has desinscrito de la asignatura correctamente.');
    } catch (err) {
      console.error('Error al desinscribir:', err);
      showError('Error al desinscribir', 'No se pudo completar la desinscripción. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useEffect ejecutado - cargando datos iniciales');
    loadData();
  }, []);

  console.log('🎨 Renderizando FDManager:', {
    isLoading,
    error,
    bloques: bloques.length,
    asignaturas: asignaturas.length,
    eleccionesEstudiante: eleccionesEstudiante.length,
    resumenElecciones: resumenElecciones ? 'presente' : 'null',
    isLoadingElecciones
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
            <p>• Elecciones estudiante: {eleccionesEstudiante.length}/3</p>
            <p>• Elecciones activas: {resumenElecciones?.elecciones_activas || 0}/3</p>
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
            
            {/* Indicador de elecciones */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${(resumenElecciones?.elecciones_activas || 0) > 2 ? 'bg-danger-500' : 'bg-success-500'}`} />
                <span className="text-xs text-default-600">
                  Elecciones: {resumenElecciones?.elecciones_activas || 0}/3
                </span>
              </div>
            </div>
            
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
          {isLoadingElecciones ? (
            <div className="flex justify-center items-center py-12">
              <Spinner label="Cargando tus elecciones..." size="lg" />
            </div>
          ) : resumenElecciones ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  color="primary"
                  isLoading={isLoadingElecciones}
                  size="sm"
                  variant="flat"
                  onPress={loadElecciones}
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Actualizar Elecciones
                </Button>
              </div>
              <EleccionesEstudiante
                isLoading={isLoading}
                resumen={resumenElecciones}
                onDesinscribir={handleDesinscribir}
              />
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-12">
                <UserIcon className="w-12 h-12 mx-auto mb-4 text-default-300" />
                <p className="text-lg font-medium mb-2">No se pudieron cargar las elecciones</p>
                <p className="text-small text-default-500 mb-4">
                  Intenta recargar las elecciones o contacta al administrador
                </p>
                <Button
                  color="primary"
                  isLoading={isLoadingElecciones}
                  size="sm"
                  variant="flat"
                  onPress={loadElecciones}
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Recargar Elecciones
                </Button>
              </CardBody>
            </Card>
          )}
        </Tab>
      </Tabs>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default FDManager;
