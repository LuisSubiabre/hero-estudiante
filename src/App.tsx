import { Route, Routes } from "react-router-dom";

import LoginForm from "./pages/login";
import Logout from "./pages/logout";

import ProtectedRoute from "@/components/ProtectedRoute"; // Importa el componente de ruta protegida
import CourseRestrictedRoute from "@/components/CourseRestrictedRoute"; // Importa el componente de restricción por curso
import IndexPage from "@/pages/index";
import InformesPage from "@/pages/informes";
import NoDisponiblePage from "@/pages/nodisponible";
import AtrasosPage from "@/pages/atrasos";
import NotasPage from "@/pages/notas";
import AclesPage from "@/pages/acles"; // Asegúrate de que la ruta sea correcta 
import Asistencia from "@/components/Asistencia";
import Personalidad from "@/pages/personalidad";

function App() {
  return (
    <Routes>
      {/* Rutas públicas (no requieren autenticación) */}
      <Route element={<LoginForm />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      {/* Todas las demás rutas requieren autenticación */}
      <Route element={<ProtectedRoute />}>
        <Route element={<IndexPage />} path="/" />
        <Route element={<NoDisponiblePage />} path="/regular" />
        <Route element={<InformesPage />} path="/certificados" />
        <Route element={<AclesPage />} path="/acles" />
        <Route element={<Asistencia />} path="/asistencia" />
        <Route element={<AtrasosPage />} path="/atrasos" />
        
        {/* Rutas restringidas por curso */}
        <Route 
          element={
            <CourseRestrictedRoute>
              <NotasPage />
            </CourseRestrictedRoute>
          } 
          path="/notas" 
        />
        <Route 
          element={
            <CourseRestrictedRoute>
              <Personalidad />
            </CourseRestrictedRoute>
          } 
          path="/personalidad" 
        />
      </Route>
    </Routes>
  );
}

export default App;
