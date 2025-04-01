import { Route, Routes } from "react-router-dom";

import LoginForm from "./pages/login";
import Logout from "./pages/logout";

import ProtectedRoute from "@/components/ProtectedRoute"; // Importa el componente de ruta protegida
import IndexPage from "@/pages/index";
import InformesPage from "@/pages/informes";
import NoDisponiblePage from "@/pages/nodisponible";
import AtrasosPage from "@/pages/atrasos";
import AclesPage from "@/pages/acles"; // Asegúrate de que la ruta sea correcta 

function App() {
  return (
    <Routes>
      {/* Rutas públicas (no requieren autenticación) */}
      <Route element={<LoginForm />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      {/* Todas las demás rutas requieren autenticación */}
      <Route element={<ProtectedRoute />}>
        <Route element={<IndexPage />} path="/" />
        <Route element={<NoDisponiblePage />} path="/notas" />
        <Route element={<NoDisponiblePage />} path="/regular" />
        <Route element={<InformesPage />} path="/certificados" />
        <Route element={<AclesPage />} path="/acles" />
        <Route element={<NoDisponiblePage />} path="/asistencia" />
        <Route element={<AtrasosPage />} path="/atrasos" />
      </Route>
    </Routes>
  );
}

export default App;
