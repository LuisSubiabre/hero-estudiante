import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos para el PDF de personalidad
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
    fontSize: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center",
    color: "#1a365d",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
    color: "#4a5568",
  },
  studentInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
    border: "1px solid #e2e8f0",
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
  },
  categorySection: {
    marginBottom: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 5,
  },
  categoryHeader: {
    backgroundColor: "#2c5282",
    color: "#ffffff",
    padding: 8,
    fontSize: 11,
    fontWeight: "bold",
  },
  categoryContent: {
    padding: 10,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  itemNumber: {
    width: 20,
    fontSize: 9,
    fontWeight: "bold",
    color: "#4a5568",
  },
  itemText: {
    flex: 1,
    fontSize: 9,
    marginRight: 10,
    lineHeight: 1.3,
  },
  statusChip: {
    backgroundColor: "#e2e8f0",
    padding: "3px 8px",
    borderRadius: 3,
    fontSize: 8,
    fontWeight: "bold",
    minWidth: 60,
    textAlign: "center",
  },
  observations: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fef5e7",
    border: "1px solid #fed7aa",
    borderRadius: 5,
  },
  observationsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#c05621",
  },
  observationsText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#744210",
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  signatureBox: {
    alignItems: "center",
  },
  signatureLine: {
    fontSize: 10,
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 9,
    color: "#4a5568",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#718096",
  },
});

// Función para obtener el color del estado
const getStatusColor = (status: string) => {
  switch (status) {
    case "Siempre":
      return "#48bb78";
    case "Frecuentemente":
      return "#ed8936";
    case "A veces":
      return "#9f7aea";
    case "Nunca":
      return "#f56565";
    case "No observado":
      return "#a0aec0";
    default:
      return "#a0aec0";
  }
};

// Función para obtener el nombre del ítem
const getItemName = (category: string, key: string): string => {
  const index = parseInt(key.match(/\d+$/)?.[0] || '1') - 1;
  
  const FORMACION_ETICA_ITEMS = [
    "Es responsable con sus tareas, trabajos y demás obligaciones escolares.",
    "Asiste a clases en forma puntual y constante",
    "Trata con respeto a sus compañeros/as, profesores/as y miembros de la comunidad",
    "Es honesto(a) en su trabajo y en su vida escolar en general, asumiendo responsabilidades en sus acciones",
    "Respeta las normas de convivencia establecidas",
    "Respeta ideas y creencias distintas a las propias",
    "Es un alumno(a) solidario(a) y generoso(a) con los demás",
    "Utiliza el diálogo como medio de resolución de conflictos",
  ];

  const CRECIMIENTO_ITEMS = [
    "Reconoce sus virtudes y defectos",
    "Es responsable con los compromisos que adquiere",
    "Se preocupa por su higiene y presentación personal",
    "Reacciona positivamente frente a situaciones nuevas o conflictivas",
    "Reconoce sus errores y trata de superarlos",
  ];

  const ENTORNO_ITEMS = [
    "Tiene un grupo de amigos(as) estable",
    "Ayuda a sus compañeros(as)",
    "Propone ideas al grupo",
    "Se ofrece voluntario(a) en las actividades a realizar",
    "Actúa con responsabilidad en el cuidado del medio ambiente",
    "Participa en actividades que el Liceo programa en la comunidad",
    "Respeta las normas disciplinarias y seguridad vigentes en el Liceo",
  ];

  const APRENDIZAJE_ITEMS = [
    "Atiende en clases",
    "Se concentra adecuadamente en el trabajo",
    "Demuestra interés y compromiso por su aprendizaje",
    "Desarrolla al máximo sus capacidades",
    "Demuestra sentido de superación",
    "Participa activamente durante la clase y/o actividades",
    "Asiste regularmente a rendir sus evaluaciones, en fecha indicada",
  ];

  const CONDUCTAS_ITEMS = [
    "Agresividad",
    "Estado de ánimo decaído",
    "Conflictos interpersonales",
    "Aislamiento, soledad",
    "Episodios de ansiedad inmanejables",
    "Excesiva pasividad",
    "Desinterés en labores académicas",
  ];
  
  switch (category) {
    case 'formacion_etica':
      return FORMACION_ETICA_ITEMS[index] || key;
    case 'crecimiento':
      return CRECIMIENTO_ITEMS[index] || key;
    case 'entorno':
      return ENTORNO_ITEMS[index] || key;
    case 'aprendizaje':
      return APRENDIZAJE_ITEMS[index] || key;
    case 'conductas':
      return CONDUCTAS_ITEMS[index] || key;
    default:
      return key;
  }
};

// Componente para renderizar una categoría
const CategorySection = ({ title, data, categoryKey }: { title: string, data: Record<string, string>, categoryKey: string }) => (
  <View style={styles.categorySection}>
    <View style={styles.categoryHeader}>
      <Text>{title}</Text>
    </View>
    <View style={styles.categoryContent}>
      {Object.entries(data).map(([key, value], index) => (
        <View key={key} style={styles.itemRow}>
          <Text style={styles.itemNumber}>{index + 1}.</Text>
          <Text style={styles.itemText}>{getItemName(categoryKey, key)}</Text>
          <View style={[styles.statusChip, { backgroundColor: getStatusColor(value) }]}>
            <Text style={{ color: "#ffffff", fontSize: 8, fontWeight: "bold" }}>
              {value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Componente principal del PDF
const PersonalidadPDF = ({ data }: { data: any }) => {
  const informe = data.informes[0]; // Tomamos el primer informe

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Logo y Encabezado */}
        <View style={styles.header}>
          <Image
            src="/images/logo_fondo_blanco.png"
            style={{ width: 120, height: 32 }}
          />
          <Text style={styles.title}>Informe de Personalidad</Text>
          <Text style={styles.subtitle}>Liceo Experimental UMAG</Text>
        </View>

        {/* Información del Estudiante */}
        <View style={styles.studentInfo}>
          <Text style={styles.infoText}>Estudiante: {data.nombre_estudiante}</Text>
          <Text style={styles.infoText}>RUT: {data.rut_estudiante}</Text>
          <Text style={styles.infoText}>Curso: {data.curso_nombre}</Text>
          <Text style={styles.infoText}>Profesor Jefe: {data.profesor_jefe_nombre}</Text>
          <Text style={styles.infoText}>Año: {informe.anio}</Text>
        </View>

        {/* Categorías del informe */}
        <CategorySection 
          categoryKey="formacion_etica" 
          data={informe.formacion_etica} 
          title="Formación Ética" 
        />
        <CategorySection 
          categoryKey="crecimiento" 
          data={informe.crecimiento} 
          title="Crecimiento y Autonomía" 
        />
        <CategorySection 
          categoryKey="entorno" 
          data={informe.entorno} 
          title="Entorno Escolar" 
        />
        <CategorySection 
          categoryKey="aprendizaje" 
          data={informe.aprendizaje} 
          title="Aprendizaje" 
        />
        <CategorySection 
          categoryKey="conductas" 
          data={informe.conductas} 
          title="Conductas" 
        />

        {/* Observaciones */}
        {informe.observaciones && (
          <View style={styles.observations}>
            <Text style={styles.observationsTitle}>Observaciones:</Text>
            <Text style={styles.observationsText}>{informe.observaciones}</Text>
          </View>
        )}

        {/* Firmas */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>_______________________</Text>
            <Text style={styles.signatureName}>{data.profesor_jefe_nombre}</Text>
            <Text style={styles.signatureName}>Profesor Jefe</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>_______________________</Text>
            <Text style={styles.signatureName}>PATRICIO BRAVO JORQUERA</Text>
            <Text style={styles.signatureName}>Director</Text>
          </View>
        </View>

        {/* Pie de página */}
        <Text style={styles.footer}>
          Documento generado el {new Date().toLocaleDateString('es-CL')}
        </Text>
      </Page>
    </Document>
  );
};

export default PersonalidadPDF; 