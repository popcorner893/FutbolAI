import React, { useEffect, useState } from "react";
import axios from "axios";
import "../HojasEstilo/Noticias.css";

/*
Este componente administra los partidos registrados en la base de datos.
cargarDatos() obtiene partidos y equipos para mostrarlos en el panel.
El formulario permite crear o editar un partido según el estado 'editando'.
guardarPartido() envía la información al backend mediante POST o PUT.
editarPartido() carga en el formulario los datos del partido seleccionado.
eliminarPartido() borra un registro previa confirmación del usuario.
El listado muestra cada partido con nombres de equipos, fecha y marcador.
*/


export default function AdminPartidos() {
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    id_partido: "",
    equipo_local_id: "",
    equipo_visitante_id: "",
    fecha: "",
    marcador_local: 0,
    marcador_visitante: 0
  });

  const cargarDatos = async () => {
    try {
      const resPartidos = await axios.get("http://localhost:3001/api/partidos");
      const resEquipos = await axios.get("http://localhost:3001/api/equipos");

      setPartidos(resPartidos.data);
      setEquipos(resEquipos.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarPartido = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:3001/api/partidos/${form.id_partido}`, form);
      } else {
        await axios.post("http://localhost:3001/api/partidos", form);
      }
      setForm({
        id_partido: "",
        equipo_local_id: "",
        equipo_visitante_id: "",
        fecha: "",
        marcador_local: 0,
        marcador_visitante: 0
      });
      setEditando(false);
      cargarDatos();
    } catch (error) {
      console.error("Error guardando partido:", error);
    }
  };

  const editarPartido = (p) => {
    setForm(p);
    setEditando(true);
  };

  const eliminarPartido = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este partido?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/partidos/${id}`);
      cargarDatos();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="noticias-container">
      <h2 className="titulo-noticias">Administrar Partidos</h2>

      {/* FORMULARIO */}
      <div className="noticia-card p-4" style={{ margin: "0 auto 30px auto" }}>
        <h3>{editando ? "Editar Partido" : "Crear Partido"}</h3>

        <form onSubmit={guardarPartido}>
          <label>Equipo Local</label>
          <select
            className="form-control mb-2"
            name="equipo_local_id"
            value={form.equipo_local_id}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {equipos.map((e) => (
              <option key={e.id_equipo} value={e.id_equipo}>
                {e.nombre}
              </option>
            ))}
          </select>

          <label>Equipo Visitante</label>
          <select
            className="form-control mb-2"
            name="equipo_visitante_id"
            value={form.equipo_visitante_id}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione</option>
            {equipos.map((e) => (
              <option key={e.id_equipo} value={e.id_equipo}>
                {e.nombre}
              </option>
            ))}
          </select>

          <label>Fecha del Partido</label>
          <input
            className="form-control mb-2"
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={manejarCambio}
            required
          />

          <label>Marcador Local</label>
          <input
            className="form-control mb-2"
            type="number"
            name="marcador_local"
            value={form.marcador_local}
            onChange={manejarCambio}
          />

          <label>Marcador Visitante</label>
          <input
            className="form-control mb-3"
            type="number"
            name="marcador_visitante"
            value={form.marcador_visitante}
            onChange={manejarCambio}
          />

          <button className="btn btn-success w-100" type="submit">
            {editando ? "Guardar Cambios" : "Crear Partido"}
          </button>
        </form>
      </div>

      {/* LISTADO */}
      <div className="noticias-grid">
        {partidos.map((p) => (
          <div key={p.id_partido} className="noticia-card p-3">
            <div className="noticia-contenido">
              <h3>{equipos.find((e) => e.id_equipo === p.equipo_local_id)?.nombre} vs {equipos.find((e) => e.id_equipo === p.equipo_visitante_id)?.nombre}</h3>

              <p>
                Fecha:{" "}
                {new Date(p.fecha).toLocaleString("es-ES")}
              </p>

              <p>
                Marcador: {p.marcador_local} - {p.marcador_visitante}
              </p>

              <button
                className="btn btn-outline-success w-100 mb-2"
                onClick={() => editarPartido(p)}
              >
                ✏ Editar
              </button>

              <button
                className="btn btn-outline-danger w-100"
                onClick={() => eliminarPartido(p.id_partido)}
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
