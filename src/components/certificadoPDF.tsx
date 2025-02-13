// certificadoPDF.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";

// Crear los estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontSize: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  paragraph: {
    textAlign: "justify",
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  negrita: {
    fontWeight: "ultrabold",
  },
  section: { textAlign: "justify", margin: 10 },
});

// Crear el componente del documento
const Certificado = ({
  name,
  rut,
  curso,
}: {
  name: string;
  rut: string;
  curso: string;
}) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={{ alignItems: "flex-start", marginBottom: 20 }}>
        <Image
          src="/images/logo_fondo_blanco.png"
          style={{ width: 300, height: 80 }}
        />
      </View>
      <Text style={styles.title}>CERTIFICADO ALUMNO REGULAR</Text>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          {"          "}
          Prof. <Text style={styles.negrita}>PATRICIO BRAVO JORQUERA</Text>,
          Director del Liceo Experimental Universidad de Magallanes, certifica:
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          {"          "}
          Que, <Text style={styles.negrita}>{name}</Text>, Cédula de Identidad
          N° {rut} se encuentra matriculado(a) en {curso} en este
          establecimiento educacional, asumiendo su calidad de{" "}
          <Text style={styles.negrita}>ALUMNO REGULAR</Text> a contar de marzo
          del año lectivo {new Date().getFullYear()}.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          {"          "}
          Que, el Liceo Experimental Universidad de Magallanes, es un
          Establecimiento Particular Subvencionado y tiene como Sostenedor a la
          Fundación de Desarrollo, Educación, Asistencia Técnica y Capacitación
          FUDE-UMAG, reconocida como Cooperadora del Estado por Resolucion
          Exenta Num. 0098 de fecha 27/01/2005 de Secreduc.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          {"          "}
          Se extiende el presente certificado a petición del alumno(a)
          interesado(a) para fines que estime conveniente.
        </Text>
      </View>
    </Page>
  </Document>
);

// Exportación por defecto del componente
export default Certificado;
