import { Route, Routes } from "react-router-dom";

import LoginForm from "./pages/login";
import Logout from "./pages/logout";

import ProtectedRoute from "@/components/ProtectedRoute"; // Importa el componente de ruta protegida
import IndexPage from "@/pages/index";
import InformesPage from "@/pages/informes";
import NoDisponiblePage from "@/pages/nodisponible";
import AtrasosPage from "@/pages/atrasos";
function App() {
  return (
    <Routes>
      {/* Ruta pública (login) */}
      <Route element={<LoginForm />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      {/* Rutas públicas (accesibles sin autenticación) */}
      <Route element={<IndexPage />} path="/" />

      {/* Rutas protegidas (requieren autenticación) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<NoDisponiblePage />} path="/notas" />
        <Route element={<NoDisponiblePage />} path="/regular" />
        <Route element={<InformesPage />} path="/certificados" />
        <Route element={<NoDisponiblePage />} path="/acles" />
        <Route element={<NoDisponiblePage />} path="/asistencia" />
        <Route element={<AtrasosPage />} path="/atrasos" />

        {/* Aquí puedes agregar más rutas protegidas */}
      </Route>
    </Routes>
  );
}

export default App;
