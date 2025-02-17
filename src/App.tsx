import { Route, Routes } from "react-router-dom";

import NotasPage from "./pages/notas";
import LoginForm from "./pages/login";
import Logout from "./pages/logout";
import AlumnoRegular from "./components/AlumnoRegular";

import ProtectedRoute from "@/components/ProtectedRoute"; // Importa el componente de ruta protegida
import IndexPage from "@/pages/index";
import InformesPage from "@/pages/informes";
import AsistenciaPage from "@/pages/asistencia";
import AtrasosPage from "@/pages/atrasos";
import AclesPage from "@/pages/acles";

function App() {
  return (
    <Routes>
      {/* Ruta pública (login) */}
      <Route element={<LoginForm />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      {/* Rutas públicas (accesibles sin autenticación) */}
      <Route element={<IndexPage />} path="/" />
      <Route element={<AsistenciaPage />} path="/asistencia" />
      <Route element={<AtrasosPage />} path="/atrasos" />

      {/* Rutas protegidas (requieren autenticación) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<NotasPage />} path="/notas" />
        <Route element={<AlumnoRegular />} path="/regular" />
        <Route element={<InformesPage />} path="/informes" />
        <Route element={<AclesPage />} path="/acles" />

        {/* Aquí puedes agregar más rutas protegidas */}
      </Route>
    </Routes>
  );
}

export default App;
