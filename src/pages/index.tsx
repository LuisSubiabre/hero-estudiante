import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-20">
        <div className=" flex justify-center items-center">
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
    </DefaultLayout>
  );
}
