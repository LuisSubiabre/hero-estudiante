import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { CalendarDays, MapPin } from "lucide-react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {
  searchTaller,
  talleresInscritos,
  tallerInscripcion,
  tallerRetirar,
} from "@/services/tallerService";
import { Taller } from "@/types";
export default function NotasPage() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [talleresInscritosList, setTalleresInscritosList] = useState<Taller[]>(
    []
  );
  const [loadingTalleres, setLoadingTalleres] = useState(true);
  const [loadingInscritos, setLoadingInscritos] = useState(true);
  const [errorTalleres, setErrorTalleres] = useState("");
  const [errorInscritos, setErrorInscritos] = useState("");
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Función para obtener los talleres disponibles
  const fetchTalleres = async () => {
    const curso_id = getCursoId();

    if (!curso_id) {
      setErrorTalleres("No se encontró un curso asociado al usuario.");
      setLoadingTalleres(false);

      return;
    }

    try {
      const data = await searchTaller(curso_id);

      if (data) {
        setTalleres(data);
      } else {
        setErrorTalleres("No se encontraron talleres disponibles.");
      }
    } catch (error) {
      setErrorTalleres("Hubo un error al cargar los talleres: " + error);
    } finally {
      setLoadingTalleres(false);
    }
  };

  // Función para obtener los talleres inscritos
  const fetchTalleresInscritos = async () => {
    const estudiante_id = jwtData();

    if (!estudiante_id) {
      setErrorInscritos("No se encontró el ID del estudiante.");
      setLoadingInscritos(false);

      return;
    }

    try {
      const data = await talleresInscritos(estudiante_id);

      if (data) {
        setTalleresInscritosList(data);
      } else {
        setErrorInscritos("No se encontraron talleres inscritos.");
      }
    } catch (error) {
      setErrorInscritos(
        "Hubo un error al cargar los talleres inscritos: " + error
      );
    } finally {
      setLoadingInscritos(false);
    }
  };

  // Obtener la cantidad de talleres inscritos
  const cantidadTalleresInscritos = talleresInscritosList.length;

  // Cargar los datos iniciales
  useEffect(() => {
    fetchTalleres();
    fetchTalleresInscritos();
  }, []);

  // Función para decodificar el token JWT
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

  // Función para obtener el curso_id del token
  const getCursoId = () => {
    const token = localStorage.getItem("TokenLeu");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const decoded = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        return JSON.parse(decoded).curso_id;
      } catch {
        return null;
      }
    }

    return null;
  };

  // Filtrar talleres que no estén en la lista de talleres inscritos
  const talleresDisponibles = talleres
    .filter(
      (taller) =>
        !talleresInscritosList.some(
          (inscrito) => inscrito.taller_id === taller.taller_id
        )
    )
    .sort((a, b) => {
      // El taller 54 va primero
      if (a.taller_id === 54) return -1;
      if (b.taller_id === 54) return 1;

      // El resto se ordena por ID
      return a.taller_id - b.taller_id;
    });

  // Ordenar también los talleres inscritos
  const talleresInscritosOrdenados = [...talleresInscritosList].sort((a, b) => {
    // El taller 54 va primero
    if (a.taller_id === 54) return -1;
    if (b.taller_id === 54) return 1;

    // El resto se ordena por ID
    return a.taller_id - b.taller_id;
  });

  // Función para inscribirse en un taller
  const inscribirTaller = async (taller_id: number) => {
    const estudiante_id = jwtData();

    // console.log("----->", estudiante_id);

    if (!estudiante_id) {
      setError("No se encontró el ID del estudiante.");
      onOpen();

      return;
    }

    try {
      await tallerInscripcion(estudiante_id, taller_id);
      await fetchTalleres();
      await fetchTalleresInscritos();
    } catch {
      setError("Error al inscribirse en el taller.");
      onOpen();
    }
  };

  // Función para retirarse de un taller
  const retirarTaller = async (taller_id: number) => {
    const estudiante_id = jwtData();

    if (!estudiante_id) {
      setError("No se encontró el ID del estudiante.");
      onOpen();

      return;
    }

    try {
      await tallerRetirar(estudiante_id, taller_id);
      await fetchTalleres();
      await fetchTalleresInscritos();
    } catch {
      setError("Error al retirarse en el taller.");
      onOpen();
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Talleres ACLE</h1>
          <p className="text-default-500 mt-2">
            Inscríbete en los talleres de tu interés
          </p>
          {cantidadTalleresInscritos >= 2 && (
            <div className="mt-4">
              <span className="inline-block bg-warning text-white text-sm font-semibold px-4 py-2 rounded">
                El periodo de inscripciones ha finalizado.
              </span>
            </div>
          )}
        </div>

        {/* Estado de inscripción */}
        <div className="w-full max-w-4xl">
          <Alert
            className="mb-6"
            color={cantidadTalleresInscritos >= 2 ? "warning" : "secondary"}
          >
            <div className="flex justify-between items-center w-full">
              <span>Talleres inscritos: {cantidadTalleresInscritos} de 2</span>
              {cantidadTalleresInscritos >= 2 && (
                <span className="font-semibold">
                  Límite de inscripción alcanzado
                </span>
              )}
            </div>
          </Alert>
        </div>

        {/* Listado de talleres inscritos */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Mis Talleres Inscritos</h2>
          {loadingInscritos && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          )}
          {errorInscritos && (
            <Alert className="mb-4" color="danger">
              {errorInscritos}
            </Alert>
          )}

          {!loadingInscritos && talleresInscritosOrdenados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talleresInscritosOrdenados.map((t) => (
                <Card key={t.taller_id} className="p-6 bg-primary/5">
                  <div className="flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-2">{t.nombre}</h3>
                    <div className="flex flex-col gap-3 text-default-600 mb-4">
                      <div className="flex items-start gap-2">
                        <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">Horario: {t.horario}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">Ubicación: {t.ubicacion}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      {t.taller_id === 54 && (
                        <Button
                          className="w-full"
                          color="danger"
                          variant="flat"
                          onPress={() => retirarTaller(t.taller_id)}
                        >
                          Retirarse del taller
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert color="secondary">
              No estás inscrito en ningún taller actualmente.
            </Alert>
          )}
        </div>

        {/* Listado de talleres disponibles */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Talleres Disponibles</h2>
          {loadingTalleres && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          )}
          {errorTalleres && (
            <Alert className="mb-4" color="danger">
              {errorTalleres}
            </Alert>
          )}

          {!loadingTalleres && talleresDisponibles.length > 0 && (
            <>
              {cantidadTalleresInscritos >= 2 ? (
                <>
                  <Alert className="mb-6" color="warning">
                    Ya has alcanzado el máximo de talleres permitidos. Puedes
                    ver los talleres disponibles a continuación, pero solo
                    podrás inscribirte en el taller especial. Si tienes dudas, puedes escribir a <strong>acle@liceoexperimental.cl</strong>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {talleresDisponibles.map((t) => (
                      <Card key={t.taller_id} className="p-4 bg-default-50">
                        <div className="flex flex-col h-full">
                          <h3 className="text-base font-bold mb-3">
                            {t.nombre}
                          </h3>
                          <div className="flex flex-col gap-3 text-default-600 mb-4">
                            <div className="flex items-start gap-2">
                              <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span className="flex-1">
                                Horario: {t.horario}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span className="flex-1">
                                Ubicación: {t.ubicacion}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-default-500">
                              Cupos:{" "}
                              {Math.max(
                                0,
                                t.cantidad_cupos - t.cantidad_inscritos
                              )}
                            </span>
                            {t.cantidad_cupos > t.cantidad_inscritos ? (
                              <span className="text-success">Disponible</span>
                            ) : (
                              <span className="text-danger">Sin cupos</span>
                            )}
                          </div>
                          {t.taller_id === 54 &&
                            t.cantidad_cupos > t.cantidad_inscritos && (
                              <Button
                                className="w-full mt-4"
                                color="primary"
                                onPress={() => inscribirTaller(t.taller_id)}
                              >
                                Inscribirse en el taller
                              </Button>
                            )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {talleresDisponibles.map((t) => (
                    <Card
                      key={t.taller_id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col h-full">
                        <h3 className="text-lg font-bold mb-2">{t.nombre}</h3>
                        <div className="flex flex-col gap-3 text-default-600 mb-4">
                          <div className="flex items-start gap-2">
                            <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span className="flex-1">Horario: {t.horario}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span className="flex-1">
                              Ubicación: {t.ubicacion}
                            </span>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-default-500">
                              Cupos:{" "}
                              {Math.max(
                                0,
                                t.cantidad_cupos - t.cantidad_inscritos
                              )}
                            </span>
                            {t.cantidad_cupos > t.cantidad_inscritos ? (
                              <span className="text-success text-sm">
                                Disponible
                              </span>
                            ) : (
                              <span className="text-danger text-sm">
                                Sin cupos
                              </span>
                            )}
                          </div>
                          {t.taller_id === 54 &&
                            t.cantidad_cupos > t.cantidad_inscritos && (
                              <Button
                                className="w-full"
                                color="primary"
                                onPress={() => inscribirTaller(t.taller_id)}
                              >
                                Inscribirse en el taller
                              </Button>
                            )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          {!loadingTalleres && talleresDisponibles.length === 0 && (
            <Alert className="mb-6" color="danger">
              No hay talleres disponibles en este momento.
            </Alert>
          )}
        </div>
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Atención
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">{error}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
