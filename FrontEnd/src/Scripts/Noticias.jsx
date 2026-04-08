import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../HojasEstilo/Noticias.css";
import axios from "axios";

/* Componente Noticias: carga desde la BD todas las noticias registradas y las
muestra en forma de tarjetas. La función cargarNoticias consulta la API y guarda
el resultado en el estado. Mientras se obtiene la información, se muestra un
mensaje de carga. getLink determina si el usuario debe navegar por rutas públicas
o privadas según su autenticación. Finalmente, se renderiza una cuadrícula con
imagen, título y descripción de cada noticia, permitiendo abrir cada una en detalle. */



export default function Noticias() {

  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Cargar noticias desde la BD
  const cargarNoticias = async () => {
    try {
      console.log("📰 Cargando noticias...");
      const res = await axios.get("http://localhost:3001/api/noticias");
      console.log("✅ Noticias cargadas:", res.data);
      setNoticias(res.data);
    } catch (err) {
      console.error("❌ Error cargando noticias:", err);
      setNoticias([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  if (cargando) {
    return (
      <div className="noticias-container">
        <h2 className="titulo-noticias">📰 Cargando noticias...</h2>
      </div>
    );
  }

  // Determinar la ruta base según si está autenticado
  const getLink = (noticiaId) => {
    // Si estamos en una ruta privada (/app/*), usar ruta privada
    if (location.pathname.includes("/app/")) {
      return `/app/noticias/${noticiaId}`;
    }
    // Si estamos en ruta pública, usar ruta pública
    return `/noticias/${noticiaId}`;
  };

  return (
    <div className="noticias-container">
      <h2 className="titulo-noticias">📰 Últimas Noticias del Fútbol</h2>

      {noticias.length === 0 ? (
        <p className="text-center">No hay noticias disponibles aún</p>
      ) : (
        <div className="noticias-grid">
          {noticias.map((n) => (
            <Link
              key={n.id_noticia}
              to={getLink(n.id_noticia)}
              className="noticia-card"
            >
              <img src={n.ruta_imagen || "/assets/noticias/default.jpg"} alt={n.titulo} className="noticia-imagen" />
              <div className="noticia-contenido">
                <h3>{n.titulo}</h3>
                <p>{n.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

