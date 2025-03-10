import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-20">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full animate-pulse" />
          <svg
            className="w-full h-full text-primary-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09v-4.82L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
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
    </DefaultLayout>
  );
}
