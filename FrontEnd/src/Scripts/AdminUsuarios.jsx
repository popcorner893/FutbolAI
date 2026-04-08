import React, { useEffect, useState } from "react";
import axios from "axios";

/* Este módulo administra los usuarios registrados en el sistema.
cargarUsuarios(): obtiene desde el backend la lista completa en formato JSON.
El formulario permite crear nuevos usuarios o editar uno existente usando editId.
manejarSubmit(): envía los datos mediante POST o PUT según corresponda.
editar(): carga en el formulario la información del usuario seleccionado.
eliminar(): solicita confirmación y borra un usuario mediante DELETE.
El componente muestra un formulario horizontal y una tabla con todos los usuarios.
*/


const verde = "#27ae60";
const verdeOscuro = "#1e8449";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [editId, setEditId] = useState(null);

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f4f4f4",
    fontSize: "14px",
    flex: "1",
    marginRight: "10px",
  };

  // Obtener usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Crear o actualizar usuario
  const manejarSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3001/api/usuarios/${editId}`
      : "http://localhost:3001/api/usuarios";

    try {
      if (editId) {
        await axios.put(url, form);
      } else {
        await axios.post(url, form);
      }

      setForm({ nombre: "", email: "", password: "" });
      setEditId(null);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  const editar = (u) => {
    setForm({
      nombre: u.nombre,
      email: u.email,
      password: u.password,
    });
    setEditId(u.id_usuario);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      cargarUsuarios();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Administrar Usuarios</h2>

      {/* FORMULARIO HORIZONTAL */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        <form
          onSubmit={manejarSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          <strong style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
            {editId ? "Editar usuario" : "Crear usuario"}:
          </strong>

          <input
            style={inputStyle}
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />

          <input
            style={inputStyle}
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            style={inputStyle}
            type="text"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: verde,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => (e.target.style.background = verdeOscuro)}
            onMouseOut={(e) => (e.target.style.background = verde)}
          >
            {editId ? "Actualizar" : "Crear"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <table
        className="table table-striped"
        style={{ background: "#fff", borderRadius: "10px", overflow: "hidden" }}
      >
        <thead>
          <tr style={{ background: verde, color: "white" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th style={{ textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editar(u)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(u.id_usuario)}
                  style={{ marginLeft: "8px" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsuarios;



