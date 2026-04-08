import React, { useState, useEffect } from "react";
import axios from "axios";
import "../HojasEstilo/Noticias.css";

/*
Este componente permite administrar equipos desde el panel privado,
cargando la lista desde el backend y mostrando cada registro con su logo.
Incluye un formulario que sirve tanto para crear como para editar equipos,
según el estado 'editando'. Las funciones principales son cargarEquipos()
para obtener datos, guardarEquipo() para enviar POST/PUT y eliminarEquipo()
para borrar registros. manejarCambio actualiza el formulario en tiempo real.
El listado renderiza cada equipo con opciones de edición y eliminación.
*/


export default function AdminEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({ id_equipo: "", nombre: "", liga: "", logo: "" });
  const [editando, setEditando] = useState(false);

  const cargarEquipos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/equipos");
      setEquipos(res.data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarEquipo = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/equipos/${form.id_equipo}`, form);
      } else {
        await axios.post("http://localhost:3001/api/equipos", form);
      }
      setForm({ id_equipo: "", nombre: "", liga: "", logo: "" });
      setEditando(false);
      cargarEquipos();
    } catch (error) {
      console.error("Error guardando equipo:", error);
    }
  };

  const editarEquipo = (equipo) => {
    setForm(equipo);
    setEditando(true);
  };

  const eliminarEquipo = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este equipo?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/equipos/${id}`);
      cargarEquipos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="noticias-container">
      <h2 className="titulo-noticias">Administrar Equipos</h2>

      {/* FORMULARIO */}
      <div className="noticia-card p-4" style={{ margin: "0 auto 30px auto" }}>
        <h3>{editando ? "Editar Equipo" : "Crear Equipo"}</h3>

        <form onSubmit={guardarEquipo}>
          <input
            className="form-control mb-2"
            type="number"
            placeholder="ID del equipo"
            name="id_equipo"
            value={form.id_equipo}
            onChange={manejarCambio}
            required
            disabled={editando}
          />
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            required
          />
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Liga"
            name="liga"
            value={form.liga}
            onChange={manejarCambio}
          />
          <input
            className="form-control mb-3"
            type="text"
            placeholder="URL del logo"
            name="logo"
            value={form.logo}
            onChange={manejarCambio}
          />

          <button className="btn btn-success w-100" type="submit">
            {editando ? "Guardar Cambios" : "Crear Equipo"}
          </button>
        </form>
      </div>

      {/* LISTADO */}
      <div className="noticias-grid">
        {equipos.map((e) => (
          <div key={e.id_equipo} className="noticia-card">
            <img
              src={e.logo || "/assets/equipos/default.png"}
              alt={e.nombre}
              className="noticia-imagen"
            />
            <div className="noticia-contenido">
              <h3>{e.nombre}</h3>
              <p>{e.liga}</p>

              <button
                className="btn btn-outline-success w-100 mb-2"
                onClick={() => editarEquipo(e)}
              >
                ✏ Editar
              </button>

              <button
                className="btn btn-outline-danger w-100"
                onClick={() => eliminarEquipo(e.id_equipo)}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
