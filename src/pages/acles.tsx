import { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner } from "@heroui/react";

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

  // Función para obtener los talleres disponibles
  const fetchTalleres = async () => {
    const curso_id = jwtData();

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
    try {
      const data = await talleresInscritos(325); // Usamos talleresInscritos aquí

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
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload

        return payload.curso_id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);

        return null;
      }
    } else {
      console.log("No se encontró un token.");

      return null;
    }
  };

  // Filtrar talleres que no estén en la lista de talleres inscritos
  const talleresDisponibles = talleres.filter(
    (taller) =>
      !talleresInscritosList.some(
        (inscrito) => inscrito.taller_id === taller.taller_id
      )
  );

  // Función para inscribirse en un taller
  const inscribirTaller = async (taller_id: number) => {
    try {
      await tallerInscripcion(325, taller_id); // Realizar la inscripción
      // Volver a cargar los datos después de inscribirse
      await fetchTalleres();
      await fetchTalleresInscritos();
    } catch (error) {
      console.error("Error al inscribirse en el taller:", error);
    }
  };

  // Función para retirarse de un taller
  const retirarTaller = async (taller_id: number) => {
    try {
      await tallerRetirar(325, taller_id); // Realizar el retiro
      // Volver a cargar los datos después de retirarse
      await fetchTalleres();
      await fetchTalleresInscritos();
    } catch (error) {
      console.error("Error al retirarse del taller:", error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Talleres ACLE</h1>
        </div>

        {/* Listado de talleres disponibles */}
        <div>
          {loadingTalleres && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}
          {errorTalleres && <p className="text-red-500">{errorTalleres}</p>}

          {!loadingTalleres && talleresDisponibles.length > 0 && (
            <>
              {cantidadTalleresInscritos >= 2 ? (
                <Alert color="warning">
                  Solo puedes inscribirte en un máximo de 2 talleres.
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {talleresDisponibles.map((t) => (
                    <Card key={t.taller_id} className="p-4 mb-2">
                      <h2 className="font-bold">{t.nombre}</h2>
                      <p>ID: {t.taller_id}</p>
                      <Button onPress={() => inscribirTaller(t.taller_id)}>
                        Inscribirse
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          {!loadingTalleres && talleresDisponibles.length === 0 && (
            <Alert color="danger">No hay talleres disponibles.</Alert>
          )}
        </div>

        {/* Listado de talleres inscritos */}
        <div>
          <Alert color="secondary">
            Talleres inscritos: {cantidadTalleresInscritos} de 2
          </Alert>
          {loadingInscritos && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}
          {errorInscritos && <p className="text-red-500">{errorInscritos}</p>}

          {!loadingInscritos && talleresInscritosList.length > 0 && (
            <ul>
              {talleresInscritosList.map((t) => (
                <Card key={t.taller_id} className="p-4 mb-2">
                  <h2 className="font-bold">{t.nombre}</h2>
                  <p>ID: {t.taller_id}</p>
                  <Button onPress={() => retirarTaller(t.taller_id)}>
                    Retirarse
                  </Button>
                </Card>
              ))}
            </ul>
          )}
          {!loadingInscritos && talleresInscritosList.length === 0 && (
            <p>No estás inscrito en ningún taller.</p>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
