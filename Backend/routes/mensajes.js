const express = require("express");
const router = express.Router();
const { db } = require("../BaseD/connection"); // tu conexión mysql2 (promise pool)

/* Módulo que gestiona los mensajes publicados por los usuarios. Incluye
   rutas para listar todos los mensajes junto con su autor, crear nuevos
   mensajes validando datos obligatorios, y obtener solo los mensajes de
   las personas a las que un usuario sigue. Utiliza consultas MySQL para
   combinar tablas y ordenar cronológicamente. Sirve como capa intermedia
   entre el cliente y la base de datos, manejando la lógica principal de
   publicación y visualización de mensajes dentro del sistema. */


// ===============================
//  GET: obtener todos los mensajes
// ===============================
router.get("/", async (req, res) => {
  const sql = `
    SELECT m.id_mensaje, m.texto, m.fecha,
           u.id_usuario, u.nombre
    FROM mensajes m
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    ORDER BY m.fecha ASC
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ===============================
//  POST: crear un mensaje nuevo
// ===============================
router.post("/", async (req, res) => {
  const { id_usuario, texto } = req.body;

  // Validar que lleguen los datos
  if (!id_usuario || !texto) {
    return res.status(400).json({ error: "Faltan datos: id_usuario y texto son obligatorios" });
  }

  // Validar que el texto no esté vacío
  if (texto.trim() === "") {
    return res.status(400).json({ error: "El texto del mensaje no puede estar vacío" });
  }

  const sql = "INSERT INTO mensajes (id_usuario, texto) VALUES (?, ?)";

  try {
    const [result] = await db.query(sql, [id_usuario, texto]);
    res.json({ success: true, id_mensaje: result.insertId });
  } catch (err) {
    console.error("Error al crear mensaje:", err);
    res.status(500).json({ error: "Error al crear el mensaje", details: err.message });
  }
});

// ================================================
//  GET: mensajes solo de las personas que sigo (opcional)
// ================================================
router.get("/siguiendo/:id", async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT m.id_mensaje, m.texto, m.fecha, u.id_usuario, u.nombre
    FROM mensajes m
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE m.id_usuario IN (
        SELECT seguido_id FROM seguidores WHERE seguidor_id = ?
    )
    ORDER BY m.fecha ASC
  `;

  try {
    const [results] = await db.query(sql, [id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;