import React, { useEffect, useState } from "react";
import "../HojasEstilo/TableroMensajes.css";
import axios from "axios";
import { useAuth } from "./AuthContext";

/* TableroSocial: componente que muestra un muro de mensajes tipo foro.
Carga desde la BD los comentarios y la lista de usuarios que el actual sigue,
usando axios para comunicarse con el backend. Permite seguir o dejar de seguir
usuarios, verificando primero si ya existe dicha relación. También permite
publicar nuevos mensajes, validando su contenido antes de enviarlos. El hook
useEffect actualiza los datos cuando el usuario autenticado cambia. El estado
local almacena comentarios, texto nuevo y la lista de seguidos. */


export default function TableroSocial() {

  const { user } = useAuth();

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [siguiendo, setSiguiendo] = useState([]);

  // Cargar mensajes desde la BD
  const cargarMensajes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/mensajes");
      setComentarios(res.data);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    }
  };

  // Cargar seguidos
  const cargarSiguiendo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/seguidores/siguiendo/${user.id_usuario}`
      );
      setSiguiendo(res.data);
    } catch (err) {
      console.error("Error cargando seguidos:", err);
    }
  };

  useEffect(() => {
    if (user) {
      cargarMensajes();
      cargarSiguiendo();
    }
  }, [user]);

  const sigoA = (id) => siguiendo.some((u) => u.id_usuario === id);

  const seguir = async (idSeguido) => {
    // Evitar que se siga a uno mismo
    if (idSeguido === user.id_usuario) {
      console.warn("No puedes seguirte a ti mismo");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/seguidores/seguir", {
        seguidor_id: user.id_usuario,
        seguido_id: idSeguido
      });
      // Actualizar estado localmente inmediatamente
      setSiguiendo([...siguiendo, { id_usuario: idSeguido }]);
    } catch (err) {
      console.error("Error al seguir:", err);
      alert("Error al seguir: " + (err.response?.data?.error || err.message));
    }
  };

  const dejar = async (idSeguido) => {
    try {
      await axios.delete("http://localhost:3001/api/seguidores/dejar", {
        data: {
          seguidor_id: user.id_usuario,
          seguido_id: idSeguido
        }
      });
      // Actualizar estado localmente inmediatamente
      setSiguiendo(siguiendo.filter((u) => u.id_usuario !== idSeguido));
    } catch (err) {
      console.error("Error al dejar de seguir:", err);
      alert("Error al dejar de seguir: " + (err.response?.data?.error || err.message));
    }
  };

  const agregarComentario = async () => {
    if (nuevoComentario.trim() === "") {
      alert("Escribe un mensaje antes de enviar");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/mensajes", {
        id_usuario: user.id_usuario,
        texto: nuevoComentario
      });

      if (response.data.success) {
        setNuevoComentario("");
        cargarMensajes(); // Recargar mensajes para mostrar el nuevo
      }
    } catch (err) {
      console.error("Error agregando mensaje:", err);
      alert("Error al enviar el mensaje: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="centrosocial-container">
      <h2>💬 Tablero Social de Mensajes</h2>

      <div className="foro-container">
        {comentarios.map((c) => (
          <div key={c.id_mensaje} className="comentario">

            <div className="d-flex justify-content-between align-items-center">
              <strong>{c.nombre}</strong>

              {c.id_usuario !== user.id_usuario && (
                sigoA(c.id_usuario) ? (
                  <button className="btn btn-sm btn-danger" onClick={() => dejar(c.id_usuario)}>
                    Siguiendo ✓
                  </button>
                ) : (
                  <button className="btn btn-sm btn-success" onClick={() => seguir(c.id_usuario)}>
                    Seguir
                  </button>
                )
              )}
            </div>

            <span>{c.texto}</span>
          </div>
        ))}
      </div>

      <div className="nuevo-comentario">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu opinión sobre el último partido..."
        />
        <button onClick={agregarComentario}>Enviar</button>
      </div>

    </div>
  );
}
 