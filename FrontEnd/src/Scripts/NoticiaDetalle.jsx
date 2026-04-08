import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import "../HojasEstilo/Noticias.css";
import axios from "axios";

/* Muestra el detalle completo de una noticia seleccionada. Usa useParams para
obtener el ID desde la URL y cargar la información mediante una consulta al
backend. Gestiona estados de carga y error para mostrar mensajes apropiados.
getVolverLink determina si el usuario regresa al panel privado o a la vista
pública. Renderiza imagen, título, descripción, contenido y autor, aplicando
estilos y manejo de valores por defecto. Facilita la navegación entre listas y
detalles dentro del módulo de noticias. */


export default function NoticiaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        console.log("📰 Cargando noticia con ID:", id);
        const res = await axios.get(`http://localhost:3001/api/noticias/${id}`);
        console.log("✅ Noticia cargada:", res.data);
        setNoticia(res.data);
      } catch (err) {
        console.error("❌ Error cargando noticia:", err);
        setError(err.message);
        setNoticia(null);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarNoticia();
    }
  }, [id]);

  // Determinar la ruta de retorno según si estamos en contexto privado o público
  const getVolverLink = () => {
    if (location.pathname.includes("/app/")) {
      return "/app/noticias";
    }
    return "/noticias";
  };

  if (cargando) {
    return (
      <div className="noticia-detalle contenedor">
        <p>⏳ Cargando noticia...</p>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="noticia-detalle contenedor">
        <p>⚠️ No se pudo cargar la noticia. {error && `Error: ${error}`}</p>
        <Link to={getVolverLink()} className="btn btn-outline-success">
          ← Volver a Noticias
        </Link>
      </div>
    );
  }

  return (
    <div className="noticia-detalle contenedor card shadow-sm p-4">
      <Link to={getVolverLink()} className="volver-link mb-3">
        ← Volver a Noticias
      </Link>

      {/* IMAGEN AJUSTADA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <img
          src={noticia.ruta_imagen || "/assets/noticias/default.jpg"}
          alt={noticia.titulo}
          style={{
            width: "auto",
            maxWidth: "100%",
            maxHeight: "350px",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        />
      </div>

      <h2 className="mt-3" style={{ color: "#16A34A" }}>
        {noticia.titulo}
      </h2>
      <p className="text-secondary">{noticia.descripcion}</p>

      <div style={{ marginTop: 12, lineHeight: 1.6 }}>
        <p>
          {noticia.contenido || "Contenido de la noticia no disponible"}
        </p>
        <p className="text-muted">
          Autor: {noticia.autor || "Futbol.AI"} — {new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')}
        </p>
      </div>

      <Link to={getVolverLink()} className="btn btn-outline-success mt-3">
        ← Volver a Noticias
      </Link>
    </div>
  );
}