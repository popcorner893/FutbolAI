// Main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Oraculo from "./Scripts/Oraculo.jsx";
import LoginPage from "./Scripts/LoginPage.jsx";
import PublicLayout from "./Scripts/PublicLayout.jsx";
import PrivateLayout from "./Scripts/PrivateLayout.jsx";
import ProtectedRoute from "./Scripts/ProtectedRoute.jsx";
import TableroMensajes from "./Scripts/TableroMensajes.jsx"
import { AuthProvider } from "./Scripts/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import OraculoNotLogged from "./Scripts/OraculoNotLogged.jsx";
import Noticias from "./Scripts/Noticias.jsx";
import Home from "./Scripts/Home.jsx"
import Partidos from "./Scripts/Partidos.jsx"
import CentroSocial from "./Scripts/CentroSocial.jsx";
import TablaDePosiciones from "./Scripts/TablaDePosiciones.jsx";
import NewsAdminPanel from "./Scripts/NewsAdminPanel.jsx";
import NoticiaDetalle from "./Scripts/NoticiaDetalle.jsx";
import Files from "./Scripts/Files.jsx";
import AdminEquipos from "./Scripts/AdminEquipos.jsx";
import AdminPartidos from "./Scripts/AdminPartidos.jsx";
import AdminUsuarios from "./Scripts/AdminUsuarios.jsx";

/*
Este script configura el punto de entrada principal de la app en React.
Importa los layouts públicos y privados, además de las páginas que se
encapsulan dentro de cada uno. Usa BrowserRouter para gestionar la
navegación y ProtectedRoute para restringir acceso a rutas privadas.
AuthProvider provee el contexto de autenticación para toda la aplicación.
Las rutas públicas muestran contenido general, mientras que /app agrupa
todas las secciones protegidas y de administración. También incluye un
fallback para redirigir rutas no existentes al inicio.
*/


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas dentro de PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="oraculo-not-logged" element={<OraculoNotLogged />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="noticias/:id" element={<NoticiaDetalle />} />
            <Route path="partidos" element={<Partidos />} />
            <Route path="tabla-de-posiciones" element={<TablaDePosiciones />} />
          </Route>

          {/* Página de login fuera del layout público para no mostrar nav/footer */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas: envolvemos con ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            {/* Aquí pongo /app como raíz privada*/}
            <Route path="/app" element={<PrivateLayout />}>
              {/* Rutas internas privadas */}
              <Route index element={<Home />} />
              <Route path="oraculo" element={<Oraculo />} />
              <Route path="noticias" element={<Noticias />} />
              <Route path="noticias/:id" element={<NoticiaDetalle />} />
              <Route path="partidos" element={<Partidos />} />
              <Route path="tabla-de-posiciones" element={<TablaDePosiciones />} />
              <Route path="centro-social" element={<CentroSocial />} />
              <Route path="tablero" element={<TableroMensajes />} />
              {/* Rutas solo para roles de administración */}
              <Route path="admin-noticias" element={<NewsAdminPanel />} />
              <Route path="admin-usuarios" element={<AdminUsuarios />} />
              <Route path="admin-equipos" element={<AdminEquipos />} />
              <Route path="admin-partidos" element={<AdminPartidos />} />
              <Route path="files" element={<Files />} />
            </Route>
          </Route>

          {/* Fallback para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

