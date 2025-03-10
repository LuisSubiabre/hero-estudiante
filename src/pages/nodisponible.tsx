import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h2 className="text-lg text-gray-700 dark:text-white">
            Esta sección no está disponible por el momento
          </h2>
        </div>
      </section>
    </DefaultLayout>
  );
}
