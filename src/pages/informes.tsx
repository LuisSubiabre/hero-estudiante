import AlumnoRegular from "../components/AlumnoRegular";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function InformesPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Informes</h1>
          <AlumnoRegular />
        </div>
      </section>
    </DefaultLayout>
  );
}
