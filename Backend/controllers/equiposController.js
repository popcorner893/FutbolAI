/* Controlador equiposcontroller.js: gestiona operaciones CRUD sobre la tabla
'equipos'. Incluye funciones para listar todos los equipos, obtener uno por ID,
crear nuevos registros, actualizar datos existentes y eliminar equipos. Cada
acción usa consultas SQL ejecutadas mediante el pool 'db' y devuelve la
respuesta en formato JSON. Maneja errores enviando códigos 500 o 404 según el
caso, asegurando una API limpia y estructurada para el backend. */


const { db } = require("../BaseD/connection");

exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM equipos");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM equipos WHERE id_equipo = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Equipo no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.crear = async (req, res) => {
  const { id_equipo, nombre, liga, logo } = req.body;
  try {
    await db.query(
      "INSERT INTO equipos (id_equipo, nombre, liga, logo) VALUES (?, ?, ?, ?)",
      [id_equipo, nombre, liga, logo]
    );
    res.json({ message: "Equipo creado correctamente" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, liga, logo } = req.body;
  try {
    await db.query(
      "UPDATE equipos SET nombre = ?, liga = ?, logo = ? WHERE id_equipo = ?",
      [nombre, liga, logo, id]
    );
    res.json({ message: "Equipo actualizado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM equipos WHERE id_equipo = ?", [id]);
    res.json({ message: "Equipo eliminado" });
  } catch (err) {
    res.status(500).json(err);
  }
};
