const { db } = require("../BaseD/connection");

/* Controlador de partidos:
   Gestiona todas las operaciones CRUD para la tabla "partidos" en la BD.
   listar: devuelve todos los partidos junto con los nombres de los equipos.
   obtener: busca un partido por su ID y retorna sus datos completos.
   crear: registra un nuevo partido usando los datos enviados por el cliente.
   actualizar: modifica los campos principales de un partido existente.
   eliminar: borra un partido según su ID.
   En resumen, este script administra la información de encuentros deportivos
   y centraliza su interacción con la base de datos. */


// LISTAR TODOS LOS PARTIDOS
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, 
             el.nombre AS equipo_local, 
             ev.nombre AS equipo_visitante
      FROM partidos p
      JOIN equipos el ON p.equipo_local_id = el.id_equipo
      JOIN equipos ev ON p.equipo_visitante_id = ev.id_equipo
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// OBTENER UN PARTIDO POR ID
exports.obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT p.*, 
             el.nombre AS equipo_local, 
             ev.nombre AS equipo_visitante
      FROM partidos p
      JOIN equipos el ON p.equipo_local_id = el.id_equipo
      JOIN equipos ev ON p.equipo_visitante_id = ev.id_equipo
      WHERE p.id_partido = ?
      `,
      [id]
    );
    
    if (rows.length === 0)
      return res.status(404).json({ error: "Partido no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// CREAR PARTIDO
exports.crear = async (req, res) => {
  const { equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante } = req.body;

  try {
    await db.query(
      `
      INSERT INTO partidos 
      (equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante)
      VALUES (?, ?, ?, ?, ?)
      `,
      [equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante]
    );

    res.json({ message: "Partido creado correctamente" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ACTUALIZAR PARTIDO
exports.actualizar = async (req, res) => {
  const { id } = req.params;
  const { equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante } = req.body;

  try {
    await db.query(
      `
      UPDATE partidos 
      SET equipo_local_id = ?, 
          equipo_visitante_id = ?, 
          fecha = ?, 
          marcador_local = ?, 
          marcador_visitante = ?
      WHERE id_partido = ?
      `,
      [equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante, id]
    );

    res.json({ message: "Partido actualizado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ELIMINAR PARTIDO
exports.eliminar = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM partidos WHERE id_partido = ?", [id]);
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json(err);
  }
};
