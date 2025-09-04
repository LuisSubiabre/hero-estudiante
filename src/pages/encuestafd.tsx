import React from 'react';

import DefaultLayout from "@/layouts/default";
import FDManager from "@/components/fd/FDManager";

const EncuestaFDPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Encuesta FD
            </h1>
            <p className="text-lg text-default-600">
              Participa en nuestra encuesta de Formación Diferenciada
            </p>
          </div>

          <FDManager />

          <div className="mt-8 text-center">
            <p className="text-sm text-default-400">
              ¿Tienes preguntas sobre la encuesta? Contacta a tu profesor o coordinador.
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EncuestaFDPage;
