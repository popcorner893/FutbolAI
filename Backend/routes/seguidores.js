/* Módulo de rutas dedicado a gestionar el sistema de seguidores entre usuarios.
   Permite registrar la acción de seguir o dejar de seguir a otro usuario,
   validando que no se repitan relaciones ni se intente seguir a uno mismo.
   También incluye una ruta para obtener la lista de personas que un usuario
   sigue, consultando la base de datos mediante JOIN. Este archivo implementa
   la lógica CRUD esencial del modelo “seguidores” y actúa como puente entre
   el cliente y la BD. */


const express = require("express");
const router = express.Router();
const { db } = require("../BaseD/connection"); // tu conexión mysql2 (promise pool)

// ⭐ SEGUIR Usuario
router.post("/seguir", async (req, res) => {
    const { seguidor_id, seguido_id } = req.body;

    if (!seguidor_id || !seguido_id)
        return res.status(400).json({ error: "Faltan datos" });

    // Validar que no se intente seguir a uno mismo
    if (seguidor_id === seguido_id)
        return res.status(400).json({ error: "No puedes seguirte a ti mismo" });

    try {
        await db.query(
            "INSERT IGNORE INTO seguidores (seguidor_id, seguido_id) VALUES (?, ?)",
            [seguidor_id, seguido_id]
        );

        res.json({ message: "Ahora sigues a este usuario" });
    } catch (err) {
        console.error("Error al seguir:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// ⭐ DEJAR DE SEGUIR
router.delete("/dejar", async (req, res) => {
    const { seguidor_id, seguido_id } = req.body;

    try {
        await db.query(
            "DELETE FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?",
            [seguidor_id, seguido_id]
        );

        res.json({ message: "Has dejado de seguir" });
    } catch (err) {
        console.error("Error al dejar de seguir:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// ⭐ OBTENER LISTA DE SEGUIDOS (AMIGOS)
router.get("/siguiendo/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const [rows] = await db.query(
            `SELECT u.id_usuario, u.nombre, u.email 
             FROM seguidores s
             JOIN usuarios u ON s.seguido_id = u.id_usuario
             WHERE s.seguidor_id = ?`,
            [id]
        );

        res.json(rows);
    } catch (err) {
        console.error("Error al obtener seguidos:", err);
        res.status(500).json({ error: "Error en servidor" });
    }
});

module.exports = router;