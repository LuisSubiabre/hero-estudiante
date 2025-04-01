import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/context/AuthContext";

export default function IndexPage() {
  const { isAuthenticated } = useAuth();

  return (
    <DefaultLayout>
      {isAuthenticated ? (
        <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-12">
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              Calendario Académico
            </h2>
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <iframe
                className="rounded-lg"
                frameBorder="0"
                height="600"
                scrolling="no"
                src="https://calendar.google.com/calendar/embed?src=liceoexperimental.cl_v1vo40hg7ljnh1avc8tmlcnmf0%40group.calendar.google.com&ctz=America%2FPunta_Arenas"
                style={{ border: 0 }}
                title="Calendario Académico"
                width="100%"
               />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                Inspectores por Niveles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary-500">Educación Básica</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">Nivel de Transición 1 y 2</span>
                      <div className="text-right">
                        <div>Arielle Guerra</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">aguerra@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">1os y 2os Básico</span>
                      <div className="text-right">
                        <div>Paola Cárdenas</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">pcardenas@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">3os y 4os Básico</span>
                      <div className="text-right">
                        <div>Margarita Carreño</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">mcarreno@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">5os y 6os Básicos</span>
                      <div className="text-right">
                        <div>Ricardo Ahumada</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">rahumada@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">7os y 8os Básicos</span>
                      <div className="text-right">
                        <div>Marta Ilnao</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">milnao@liceoexperimental.cl</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary-500">Educación Media</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">1os AC y 2os AB Medios</span>
                      <div className="text-right">
                        <div>Elizabeth Galindo</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">egalindo@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">1° B y 3os Medios</span>
                      <div className="text-right">
                        <div>Ariela Hijerra</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">mhijerra@liceoexperimental.cl</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <span className="font-medium">2° C y 4os Medios</span>
                      <div className="text-right">
                        <div>Ángela Vidal</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">avidal@liceoexperimental.cl</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-20">
          <div className="flex justify-center items-center">
            <img
              alt="Logo Liceo Experimental Umag"
              className="w-[200px] h-[200px] mb-6"
              src="https://res.cloudinary.com/dx219dazh/image/upload/v1741889701/varios/xv0dt5dgdzvjj5jjrfcl.png"
            />
          </div>

          <div className="inline-block max-w-2xl text-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-800 dark:text-white">Liceo&nbsp;</span>
              <span className="text-primary-500">Experimental&nbsp;</span>
              <span className="text-gray-800 dark:text-white">Umag</span>
            </h1>

            <div className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              La verdad a través de la razón
            </div>
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
