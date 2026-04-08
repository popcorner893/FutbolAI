import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

/* Componente NewsAdmin: permite a usuarios autenticados crear noticias nuevas.
Maneja campos de título, descripción, contenido, categoría e imagen en Base64.
handleImageChange(): convierte la imagen seleccionada en una vista previa y la guarda.
handleSubmit(): valida campos, envía la noticia al backend y limpia el formulario.
Cambia dinámicamente el estado de carga y muestra mensajes de éxito o error.
Si se recibe un callback 'onNoticiaCreada', lo ejecuta tras publicar. */


export default function NewsAdmin({ onNoticiaCreada }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cargando, setCargando] = useState(false);

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

    if (!user) {
      setMessage("❌ Debes estar autenticado");
      return;
    }

    setCargando(true);

    try {
      console.log("📝 Creando noticia...");
      
      const res = await axios.post("http://localhost:3001/api/noticias", {
        titulo: title,
        descripcion: description,
        contenido: content,
        categoria: category,
        ruta_imagen: image,  
        autor_id: user.id_usuario
      });

      console.log("✅ Noticia creada:", res.data);
      
      // Limpiar formulario
      setTitle("");
      setContent("");
      setDescription("");
      setCategory("General");
      setImage(null);
      setPreview(null);
      setMessage("✅ Noticia publicada con éxito");

      // Llamar callback si existe
      if (onNoticiaCreada) {
        onNoticiaCreada(res.data);
      }

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("❌ Error creando noticia:", err);
      setMessage("❌ Error al publicar la noticia: " + (err.response?.data?.error || err.message));
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="news-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título de la noticia"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={cargando}
      />
      
      <textarea
        placeholder="Descripción corta (resumen)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="2"
        disabled={cargando}
      />
      
      <textarea
        placeholder="Contenido completo de la noticia..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={cargando}
      />

      <div className="news-extra">
        <select
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

        <label className="file-input">
          📷 Subir imagen
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            disabled={cargando}
          />
        </label>
      </div>

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Vista previa" className="preview-image" />
        </div>
      )}

      <button type="submit" disabled={cargando}>
        {cargando ? "⏳ Publicando..." : "Publicar noticia"}
      </button>

      {message && <p className={`success-msg ${message.includes("Error") ? "text-danger" : ""}`}>{message}</p>}
    </form>
  );
}