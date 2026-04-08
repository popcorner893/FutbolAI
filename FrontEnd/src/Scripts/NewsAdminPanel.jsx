import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "../HojasEstilo/Noticias.css";

/* Panel de administración de noticias: carga y muestra solo las noticias creadas
por el usuario autenticado. Permite crear, editar y eliminar elementos desde una
interfaz con tabla y formulario dinámico. cargarNoticias() obtiene y filtra las
noticias del backend; eliminarNoticia() borra registros confirmados por el usuario.
NewsAdminForm gestiona tanto la creación como la edición, cargando datos existentes,
previsualizando imágenes y enviando los cambios al servidor. Maneja estados de carga,
validaciones y retroalimentación visual para cada acción. */


export default function NewsAdminPanel() {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  // Cargar noticias del admin
  const cargarNoticias = async () => {
    try {
      console.log("📰 Cargando noticias...");
      const res = await axios.get("http://localhost:3001/api/noticias");
      // Filtrar solo las noticias del usuario actual
      const noticiasDelAdmin = res.data.filter(n => n.autor_id === user.id_usuario);
      console.log(`✅ Se encontraron ${noticiasDelAdmin.length} noticias del admin`);
      setNoticias(noticiasDelAdmin);
    } catch (err) {
      console.error("❌ Error cargando noticias:", err);
      setNoticias([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (user) {
      cargarNoticias();
    }
  }, [user]);

  // Eliminar noticia
  const eliminarNoticia = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      return;
    }

    try {
      console.log("🗑️ Eliminando noticia:", id);
      await axios.delete(`http://localhost:3001/api/noticias/${id}`, {
        data: {
          autor_id: user.id_usuario
        }
      });
      console.log("✅ Noticia eliminada");
      setNoticias(noticias.filter(n => n.id_noticia !== id));
    } catch (err) {
      console.error("❌ Error eliminando noticia:", err);
      alert("Error al eliminar la noticia: " + (err.response?.data?.error || err.message));
    }
  };

  // Editar noticia
  const editarNoticia = (noticia) => {
    setEditando(noticia);
    setMostrarForm(true);
  };

  if (!user) {
    return <div className="container mt-4"><p>⚠️ Debes estar autenticado</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: "#16A34A" }}>
        📰 Panel de Administración de Noticias
      </h2>

      {/* BOTÓN CREAR NOTICIA */}
      {!mostrarForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => {
            setEditando(null);
            setMostrarForm(true);
          }}
        >
          ➕ Crear Nueva Noticia
        </button>
      )}

      {/* FORMULARIO CREAR/EDITAR */}
      {mostrarForm && (
        <NewsAdminForm
          noticia={editando}
          onGuardar={() => {
            setMostrarForm(false);
            cargarNoticias();
          }}
          onCancelar={() => {
            setMostrarForm(false);
            setEditando(null);
          }}
          user={user}
        />
      )}

      {/* LISTA DE NOTICIAS */}
      <div className="mt-4">
        <h4>Tus Noticias ({noticias.length})</h4>

        {cargando ? (
          <p>⏳ Cargando noticias...</p>
        ) : noticias.length === 0 ? (
          <p className="text-muted">No has creado noticias aún</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {noticias.map((noticia) => (
                  <tr key={noticia.id_noticia}>
                    <td>{noticia.titulo}</td>
                    <td>
                      <span className="badge bg-info">{noticia.categoria}</span>
                    </td>
                    <td>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => editarNoticia(noticia)}
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarNoticia(noticia.id_noticia)}
                        title="Eliminar"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente del formulario
function NewsAdminForm({ noticia, onGuardar, onCancelar, user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (noticia) {
      setTitle(noticia.titulo);
      setDescription(noticia.descripcion);
      setContent(noticia.contenido);
      setCategory(noticia.categoria);
      setPreview(noticia.ruta_imagen);
    }
  }, [noticia]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !description.trim()) {
      setMessage("❌ Por favor completa todos los campos");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setCargando(true);

    try {
      const datosNoticia = {
        titulo: title,
        descripcion: description,
        contenido: content,
        categoria: category,
      };

      // Si hay imagen nueva, agregarla
      if (image) {
        datosNoticia.ruta_imagen = image;
      }

      // Si es nuevo (no tiene ID)
      if (!noticia) {
        datosNoticia.autor_id = user.id_usuario;
        console.log("📝 Creando noticia...");
        await axios.post("http://localhost:3001/api/noticias", datosNoticia);
        setMessage("✅ Noticia creada exitosamente");
      } else {
        // Si es edición
        console.log("✏️ Editando noticia:", noticia.id_noticia);
        await axios.put(
          `http://localhost:3001/api/noticias/${noticia.id_noticia}`,
          {
            ...datosNoticia,
            autor_id: user.id_usuario
          }
        );
        setMessage("✅ Noticia actualizada exitosamente");
      }

      // Limpiar formulario
      setTitle("");
      setContent("");
      setDescription("");
      setCategory("General");
      setImage(null);
      setPreview(null);

      setTimeout(() => {
        setMessage("");
        onGuardar();
      }, 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Error: " + (err.response?.data?.error || err.message));
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card p-4 mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <h4 className="mb-3">
        {noticia ? "✏️ Editar Noticia" : "➕ Crear Nueva Noticia"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Título de la noticia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={cargando}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción (Resumen) *</label>
          <textarea
            className="form-control"
            placeholder="Breve descripción o resumen..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
            disabled={cargando}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contenido Completo *</label>
          <textarea
            className="form-control"
            placeholder="Contenido completo de la noticia..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            disabled={cargando}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={cargando}
            >
              <option>Premier League</option>
              <option>La Liga</option>
              <option>Bundesliga</option>
              <option>Seleccion Colombia</option>
              <option>Liga Colombiana</option>
              <option>Mundo Deportivo</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              disabled={cargando}
            />
          </div>
        </div>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Vista previa"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success"
            disabled={cargando}
          >
            {cargando ? "⏳ Guardando..." : noticia ? "💾 Actualizar" : "📤 Publicar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={cargando}
          >
            ❌ Cancelar
          </button>
        </div>

        {message && (
          <div className={`mt-3 alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}