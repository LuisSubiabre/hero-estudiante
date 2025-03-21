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
                src="https://calendar.google.com/calendar/embed?src=liceoexperimental.cl_v1vo40hg7ljnh1avc8tmlcnmf0%40group.calendar.google.com&ctz=America%2FPunta_Arenas"
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                className="rounded-lg"
              ></iframe>
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
