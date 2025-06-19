import { useEffect, useState } from "react";
import { Card, Chip, Spinner } from "@heroui/react";
import { 
  User, 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { getPersonalidad } from "@/services/personalidad";

interface FormacionEtica {
  [key: string]: string;
  formacion_etica_1: string;
  formacion_etica_2: string;
  formacion_etica_3: string;
  formacion_etica_4: string;
  formacion_etica_5: string;
  formacion_etica_6: string;
  formacion_etica_7: string;
  formacion_etica_8: string;
}

interface Crecimiento {
  [key: string]: string;
  crecimiento_1: string;
  crecimiento_2: string;
  crecimiento_3: string;
  crecimiento_4: string;
  crecimiento_5: string;
}

interface Entorno {
  [key: string]: string;
  entorno_1: string;
  entorno_2: string;
  entorno_3: string;
  entorno_4: string;
  entorno_5: string;
  entorno_6: string;
  entorno_7: string;
}

interface Aprendizaje {
  [key: string]: string;
  aprendizaje_1: string;
  aprendizaje_2: string;
  aprendizaje_3: string;
  aprendizaje_4: string;
  aprendizaje_5: string;
  aprendizaje_6: string;
  aprendizaje_7: string;
}

interface Conductas {
  [key: string]: string;
  conductas_1: string;
  conductas_2: string;
  conductas_3: string;
  conductas_4: string;
  conductas_5: string;
  conductas_6: string;
  conductas_7: string;
}

interface Informe {
  informe_id: number;
  anio: number;
  formacion_etica: FormacionEtica;
  crecimiento: Crecimiento;
  entorno: Entorno;
  aprendizaje: Aprendizaje;
  conductas: Conductas;
  observaciones: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface PersonalidadData {
  estudiante_id: number;
  nombre_estudiante: string;
  rut_estudiante: string;
  curso_nombre: string;
  profesor_jefe_nombre: string;
  informes: Informe[];
}

interface PersonalidadResponse {
  success: boolean;
  data: PersonalidadData;
}

const FORMACION_ETICA_ITEMS = [
  "Es responsable con sus tareas, trabajos y demás obligaciones escolares.",
  "Asiste a clases en forma puntual y constante",
  "Trata con respeto a sus compañeros/as, profesores/as y miembros de la comunidad",
  "Es honesto(a) en su trabajo y en su vida escolar en general, asumiendo responsabilidades en sus acciones",
  "Respeta las normas de convivencia establecidas",
  "Respeta ideas y creencias distintas a las propias",
  "Es un alumno(a) solidario(a) y generoso(a) con los demás",
  "Utiliza el diálogo como medio de resolución de conflictos",
];

const CRECIMIENTO_ITEMS = [
  "Reconoce sus virtudes y defectos",
  "Es responsable con los compromisos que adquiere",
  "Se preocupa por su higiene y presentación personal",
  "Reacciona positivamente frente a situaciones nuevas o conflictivas",
  "Reconoce sus errores y trata de superarlos",
];

const ENTORNO_ITEMS = [
  "Tiene un grupo de amigos(as) estable",
  "Ayuda a sus compañeros(as)",
  "Propone ideas al grupo",
  "Se ofrece voluntario(a) en las actividades a realizar",
  "Actúa con responsabilidad en el cuidado del medio ambiente",
  "Participa en actividades que el Liceo programa en la comunidad",
  "Respeta las normas disciplinarias y seguridad vigentes en el Liceo",
];

const APRENDIZAJE_ITEMS = [
  "Atiende en clases",
  "Se concentra adecuadamente en el trabajo",
  "Demuestra interés y compromiso por su aprendizaje",
  "Desarrolla al máximo sus capacidades",
  "Demuestra sentido de superación",
  "Participa activamente durante la clase y/o actividades",
  "Asiste regularmente a rendir sus evaluaciones, en fecha indicada",
];

const CONDUCTAS_ITEMS = [
  "Agresividad",
  "Estado de ánimo decaído",
  "Conflictos interpersonales",
  "Aislamiento, soledad",
  "Episodios de ansiedad inmanejables",
  "Excesiva pasividad",
  "Desinterés en labores académicas",
];

export default function PersonalidadPage() {
  const [data, setData] = useState<PersonalidadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para decodificar el token JWT y obtener el estudiante_id
  const jwtData = () => {
    const token = localStorage.getItem("TokenLeu");

    if (token) {
      try {
        const base64Url = token.split(".")[1];

        // Convertir Base64URL a Base64 estándar
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        // Decodificar usando decodeURIComponent para manejar caracteres especiales
        const decoded = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const payload = JSON.parse(decoded);

        return payload.estudiante_id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);

        return null;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const estudianteId = jwtData();
        
        if (!estudianteId) {
          setError("No se encontró el ID del estudiante en el token.");
          setLoading(false);

          return;
        }

        //console.log('Solicitando informe de personalidad para estudiante ID:', estudianteId);
        const response: PersonalidadResponse = await getPersonalidad(estudianteId);

        setData(response.data);
      } catch (err) {
        setError("Error al cargar los datos de personalidad");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Siempre":
        return "success";
      case "Frecuentemente":
        return "warning";
      case "A veces":
        return "secondary";
      case "Nunca":
        return "danger";
      case "No observado":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Siempre":
        return <CheckCircle className="w-4 h-4" />;
      case "Frecuentemente":
        return <TrendingUp className="w-4 h-4" />;
      case "A veces":
        return <Clock className="w-4 h-4" />;
      case "Nunca":
        return <AlertTriangle className="w-4 h-4" />;
      case "No observado":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'formacion_etica':
        return <Award className="w-6 h-6" />;
      case 'crecimiento':
        return <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'entorno':
        return <Users className="w-6 h-6" />;
      case 'aprendizaje':
        return <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      case 'conductas':
        return <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    return 'border-l-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-l-blue-400';
  };

  const calculateProgress = (data: Record<string, string>) => {
    const total = Object.keys(data).length;
    const positiveCount = Object.values(data).filter(value => 
      value === "Siempre" || value === "Frecuentemente"
    ).length;

    return (positiveCount / total) * 100;
  };

  const getItemName = (category: string, key: string): string => {
    const index = parseInt(key.match(/\d+$/)?.[0] || '1') - 1;
    
    switch (category) {
      case 'formacion_etica':
        return FORMACION_ETICA_ITEMS[index] || key;
      case 'crecimiento':
        return CRECIMIENTO_ITEMS[index] || key;
      case 'entorno':
        return ENTORNO_ITEMS[index] || key;
      case 'aprendizaje':
        return APRENDIZAJE_ITEMS[index] || key;
      case 'conductas':
        return CONDUCTAS_ITEMS[index] || key;
      default:
        return key;
    }
  };

  const renderCategory = (title: string, data: Record<string, string>, categoryKey: string) => {
    return (
      <Card className={`w-full mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${getCategoryColor(categoryKey)}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(categoryKey)}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
          </div>
          
          <div className="space-y-2">
            {Object.entries(data).map(([key, value], index) => (
      <div
      key={key}
      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
    >
    
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-gray-800 dark:text-white">
                        {getItemName(categoryKey, key)}
                      </span>
                    </div>
                  </div>
                  <Chip 
                    className="flex-shrink-0"
                    color={getStatusColor(value) as any}
                    size="sm"
                    startContent={getStatusIcon(value)}
                    variant="flat"
                  >
                    {value}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Spinner size="lg" />
          <p>Cargando informe de personalidad...</p>
        </section>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center">
            <h2 className={title()}>Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  if (!data) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center">
            <h2 className={title()}>No se encontraron datos</h2>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  const informe = data.informes[0]; // Tomamos el primer informe

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
        <div className="inline-block max-w-4xl text-center justify-center w-full">
          <div className="mb-8">
            <h2 className={title()}>Informe de Personalidad</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Evaluación integral del desarrollo personal y académico</p>
          </div>
          
          {/* Información del estudiante */}
          <Card className="w-full mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-blue-200 dark:border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Información del Estudiante</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Datos personales y académicos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">Nombre:</span>
                  <span className="text-sm text-gray-600 dark:text-white">{data.nombre_estudiante}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">RUT:</span>
                  <span className="text-sm text-gray-600 dark:text-white">{data.rut_estudiante}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">Curso:</span>
                  <span className="text-sm text-gray-600 dark:text-white">{data.curso_nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">Profesor Jefe:</span>
                  <span className="text-sm text-gray-600 dark:text-white">{data.profesor_jefe_nombre}</span>
                </div>
              </div>
            </div>
            
            {/* <div className="mt-6 pt-4 border-t border-blue-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">Año:</span>
                    <span className="text-sm text-gray-600 dark:text-white">{informe.anio}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">Estado:</span>
                  <Chip 
                    color={informe.estado === 'creado' ? 'success' : 'warning'}
                    size="sm"
                    startContent={informe.estado === 'creado' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    variant="flat"
                  >
                    {informe.estado}
                  </Chip>
                </div>
              </div>
            </div> */}
          </Card>

          {/* Categorías del informe */}
          <div className="space-y-6">
            {renderCategory("Formación Ética", informe.formacion_etica, 'formacion_etica')}
            {renderCategory("Crecimiento y Autonomía", informe.crecimiento, 'crecimiento')}
            {renderCategory("Entorno Escolar", informe.entorno, 'entorno')}
            {renderCategory("Aprendizaje", informe.aprendizaje, 'aprendizaje')}
            {renderCategory("Conductas", informe.conductas, 'conductas')}
          </div>

          {/* Observaciones */}
          {informe.observaciones && (
            <Card className="w-full mb-6 p-6 bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Observaciones</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-100 dark:border-gray-600">
                <p className="text-gray-700 dark:text-white leading-relaxed">{informe.observaciones}</p>
              </div>
            </Card>
          )}

          {/* Fechas
          <Card className="w-full p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Información del Informe</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Fecha de Creación:</p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {new Date(informe.fecha_creacion).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Última Actualización:</p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {new Date(informe.fecha_actualizacion).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </Card> */}
        </div>
      </section>
    </DefaultLayout>
  );
}
