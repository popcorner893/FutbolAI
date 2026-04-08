import React, { useEffect, useState } from "react";
import "../HojasEstilo/Files.css";
import axios from "axios";
import iconImg from "../Multimedia/iconosArchivos/img.png";
import iconVideo from "../Multimedia/iconosArchivos/video.png";
import iconPpt from "../Multimedia/iconosArchivos/ppt.png";
import iconPdf from "../Multimedia/iconosArchivos/pdf.png";
import iconFile from "../Multimedia/iconosArchivos/file.png";

/* Componente Files: permite visualizar y gestionar archivos almacenados en el servidor.
cargarArchivos(): consulta la API y obtiene la lista actual de archivos disponibles.
subirArchivo(): envía un archivo mediante FormData al backend y recarga la lista.
obtenerIcono(): asigna un ícono según la extensión del archivo (imagen, video, ppt, pdf, etc.).
La interfaz muestra un botón para subir archivos y una cuadrícula con los archivos existentes.
Cada archivo puede abrirse en una nueva pestaña para su descarga o visualización. */


export default function Files() {
  const [files, setFiles] = useState([]);

  const cargarArchivos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/files");
      setFiles(res.data.files);
    } catch (err) {
      console.error("Error cargando archivos:", err);
    }
  };

  useEffect(() => {
    cargarArchivos();
  }, []);

  const subirArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      await axios.post("http://localhost:3001/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      cargarArchivos();
      alert("Archivo subido con éxito");
    } catch (err) {
      console.error("Error subiendo archivo:", err);
      alert("Error al subir archivo");
    }
  };

  const obtenerIcono = (nombre) => {
    const ext = nombre.split(".").pop().toLowerCase();

    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return iconImg;
    if (["mp4", "mov", "avi"].includes(ext)) return iconVideo;
    if (["ppt", "pptx"].includes(ext)) return iconPpt;
    if (["pdf"].includes(ext)) return iconPdf;

    return iconFile;
    };


  return (
    <div className="files-container">
      <div className="files-header">
        <h2>📁 Archivos en el Servidor</h2>

        <label className="upload-btn">
          Subir Archivo
          <input type="file" onChange={subirArchivo} />
        </label>
      </div>

      <h3>Archivos actuales</h3>

      <div className="files-grid">
        {files.map((f, idx) => (
          <div
            key={idx}
            className="file-card"
            onClick={() =>
              window.open(
                `http://localhost:3001/api/files/download/${f}`,
                "_blank"
              )
            }
          >
            <img src={obtenerIcono(f)} alt="icono" className="file-icon" />
            <span className="file-name">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

