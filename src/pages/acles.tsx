import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { searchTaller } from "@/services/tallerService";
import { Taller } from "@/types";

export default function NotasPage() {
  const [taller, setTaller] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //document.title = "Talleres ACLE";
    const curso_id = jwtData();

    console.log(curso_id);
    if (!curso_id) {
      setError("No se encontró un curso asociado al usuario.");
      setLoading(false);

      return;
    } else {
      searchTaller(curso_id)
        .then((data) => {
          if (data) {
            setTaller(data);
          } else {
            setError("No se encontró el taller");
          }
        })
        .catch((error) => {
          setError("Hubo un error al cargar los talleres: " + error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

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

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Talleres ACLE</h1>
        </div>

        <div>
          <h1>Listado de talleres</h1>
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && taller.length > 0 && (
            <ul>
              {taller.map((t) => (
                <li key={t.taller_id} className="border p-4 mb-2">
                  <h2 className="font-bold">{t.nombre}</h2>
                  <p>ID: {t.taller_id}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
