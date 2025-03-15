import { Button } from "@heroui/react";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-20">
        <div className="text-6xl text-primary-500" />
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Sección No Disponible.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Lo sentimos, esta sección se encuentra en desarrollo. Estamos
            trabajando para tenerla lista pronto.
          </p>
          <Button
            className="inline-flex items-center gap-2"
            variant="solid"
            onClick={handleBack}
          >
            Volver Atrás
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
