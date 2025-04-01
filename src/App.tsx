import { Route, Routes } from "react-router-dom";

import LoginForm from "./pages/login";
import Logout from "./pages/logout";

import ProtectedRoute from "@/components/ProtectedRoute";
import IndexPage from "@/pages/index";
import InformesPage from "@/pages/informes";
import NoDisponiblePage from "@/pages/nodisponible";
import AtrasosPage from "@/pages/atrasos";
import AclesPage from "@/pages/acles";

function App() {
  return (
    <Routes>
      {/* Ruta pública (login) */}
      <Route element={<LoginForm />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      {/* Rutas protegidas (requieren autenticación) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<IndexPage />} path="/" />
        <Route element={<InformesPage />} path="/informes" />
        <Route element={<NoDisponiblePage />} path="/nodisponible" />
        <Route element={<AtrasosPage />} path="/atrasos" />
        <Route element={<AclesPage />} path="/acles" />
      </Route>
    </Routes>
  );
}

export default App;
