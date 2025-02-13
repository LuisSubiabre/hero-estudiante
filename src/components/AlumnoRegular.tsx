import React from "react";
import { pdf } from "@react-pdf/renderer";

import MyDocument from "../components/certificadoPDF"; // Asegúrate de tener el componente correctamente importado

const NotasPage = () => {
  // Función para generar el PDF en el navegador
  const generatePDF = () => {
    const name = "John Doe"; // Replace with actual name
    const rut = "12345678-9"; // Replace with actual RUT

    pdf(<MyDocument name={name} rut={rut} />)
      .toBlob() // Usamos toBlob para generar un PDF como blob
      .then((blob) => {
        // Crear un enlace para descargar el PDFd
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "example.pdf"; // Nombre del archivo PDF a descargar
        link.click();
        URL.revokeObjectURL(url); // Limpiar el objeto URL
      })
      .catch((err) => {
        console.error("Error al generar el PDF:", err);
      });
  };

  return (
    <div>
      <h1>Página de Notas</h1>
      <button onClick={generatePDF}>Generar PDF</button>
    </div>
  );
};

export default NotasPage;
