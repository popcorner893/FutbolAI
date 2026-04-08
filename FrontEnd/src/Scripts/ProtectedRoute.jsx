import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

/* Componente que protege rutas privadas del sistema. Utiliza el contexto de
autenticación para verificar si el usuario inició sesión y muestra un mensaje
mientras se valida la sesión. Si el usuario está autenticado, renderiza el
contenido interno mediante Outlet; de lo contrario, redirige al login,
guardando la ubicación previa para posible retorno. Garantiza que solo usuarios
autorizados accedan a vistas restringidas. */


const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mientras verificamos la sesión, no mostrar nada (ni pública ni privada)
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>;
  }

  // Una vez cargado, decidimos si permitir acceso
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;



