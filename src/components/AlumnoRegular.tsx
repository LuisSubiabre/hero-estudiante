import { pdf } from "@react-pdf/renderer";
import { Button } from "@heroui/react";

import MyDocument from "../components/certificadoPDF"; // Asegúrate de tener el componente correctamente importado

import { useAuth } from "@/context/AuthContext";

const NotasPage = () => {
  const { user } = useAuth();

  // Función para generar el PDF en el navegador
  const generatePDF = () => {
    const name = user.nombre.toUpperCase(); // Replace with actual name
    const rut = user.rut.toUpperCase(); // Replace with actual RUT
    const curso = user.curso.toUpperCase(); // Replace with actual course

    pdf(<MyDocument curso={curso} name={name} rut={rut} />)
      .toBlob() // Usamos toBlob para generar un PDF como blob
      .then((blob) => {
        // Crear un enlace para descargar el PDFd
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `certreg-${rut.substring(0, 5)}.pdf`; // Nombre del archivo PDF a descargar
        link.click();
        URL.revokeObjectURL(url); // Limpiar el objeto URL
      })
      .catch((err) => {
        console.error("Error al generar el PDF:", err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-6">
      <Button color="primary" onPress={generatePDF}>
        Certificado Alumno Regular
      </Button>
    </div>
  );
};

export default NotasPage;
