const { db } = require("../BaseD/connection");

/* Controlador noticiascontroller.js:
   Gestiona todas las operaciones CRUD para la tabla 'noticias'.
   obtenerNoticias: devuelve todas las noticias junto al nombre del autor.
   obtenerNoticia: busca una noticia específica por su ID.
   crearNoticia: valida y registra una nueva noticia en la base de datos.
   eliminarNoticia: elimina una noticia verificando que el autor coincida.
   actualizarNoticia: permite editar solo los campos enviados, validando autoría.
   En general, este controlador centraliza la lógica de consulta, inserción,
   actualización y eliminación de noticias, manejando respuestas y errores. */



// ===============================
// GET: obtener todas las noticias
// ===============================
exports.obtenerNoticias = async (req, res) => {
    try {
        console.log("📰 Obteniendo todas las noticias...");
        
        const [noticias] = await db.query(
            `SELECT n.id_noticia, n.titulo, n.descripcion, n.categoria, n.contenido, 
                    n.ruta_imagen, n.autor_id, n.fecha_publicacion, u.nombre as autor
             FROM noticias n
             LEFT JOIN usuarios u ON n.autor_id = u.id_usuario
             ORDER BY n.fecha_publicacion DESC`
        );
        
        console.log(`✅ Se encontraron ${noticias.length} noticias`);
        res.json(noticias);
    } catch (err) {
        console.error("❌ Error obteniendo noticias:", err);
        res.status(500).json({ error: "Error al obtener noticias", details: err.message });
    }
};

// ===============================
// GET: obtener una noticia por ID
// ===============================
exports.obtenerNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("📰 Obteniendo noticia con ID:", id);
        
        const [noticias] = await db.query(
            `SELECT n.id_noticia, n.titulo, n.descripcion, n.categoria, n.contenido, 
                    n.ruta_imagen, n.autor_id, n.fecha_publicacion, u.nombre as autor
             FROM noticias n
             LEFT JOIN usuarios u ON n.autor_id = u.id_usuario
             WHERE n.id_noticia = ?`,
            [id]
        );
        
        if (noticias.length === 0) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        
        console.log("✅ Noticia encontrada:", noticias[0].titulo);
        res.json(noticias[0]);
    } catch (err) {
        console.error("❌ Error obteniendo noticia:", err);
        res.status(500).json({ error: "Error al obtener noticia", details: err.message });
    }
};

// ===============================
// POST: crear una nueva noticia
// ===============================
exports.crearNoticia = async (req, res) => {
    try {
        const { titulo, descripcion, contenido, categoria, ruta_imagen, autor_id } = req.body;
        
        console.log("📝 Creando noticia:", titulo);
        
        // Validaciones
        if (!titulo || !descripcion || !autor_id) {
            return res.status(400).json({ error: "Faltan datos obligatorios: titulo, descripcion, autor_id" });
        }
        
        const [result] = await db.query(
            `INSERT INTO noticias (titulo, descripcion, contenido, categoria, ruta_imagen, autor_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, contenido || "", categoria || "General", ruta_imagen || null, autor_id]
        );
        
        console.log("✅ Noticia creada con ID:", result.insertId);
        res.json({ 
            success: true, 
            id_noticia: result.insertId,
            message: "Noticia publicada exitosamente"
        });
    } catch (err) {
        console.error("❌ Error creando noticia:", err);
        res.status(500).json({ error: "Error al crear noticia", details: err.message });
    }
};

// ===============================
// DELETE: eliminar una noticia
// ===============================
exports.eliminarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const { autor_id } = req.body;
        
        console.log("🗑️ Eliminando noticia con ID:", id);
        
        // Obtener la noticia para verificar el autor
        const [noticias] = await db.query(
            "SELECT autor_id FROM noticias WHERE id_noticia = ?",
            [id]
        );
        
        if (noticias.length === 0) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        
        // Validación: solo el autor puede eliminar
        if (noticias[0].autor_id !== autor_id) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta noticia" });
        }
        
        const [result] = await db.query(
            "DELETE FROM noticias WHERE id_noticia = ?",
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        
        console.log("✅ Noticia eliminada");
        res.json({ success: true, message: "Noticia eliminada" });
    } catch (err) {
        console.error("❌ Error eliminando noticia:", err);
        res.status(500).json({ error: "Error al eliminar noticia", details: err.message });
    }
};

// ===============================
// PUT: actualizar una noticia
// ===============================
exports.actualizarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, contenido, categoria, ruta_imagen, autor_id } = req.body;
        
        console.log("✏️ Actualizando noticia con ID:", id);
        
        // Verificar que la noticia existe y obtener su autor
        const [noticias] = await db.query(
            "SELECT autor_id FROM noticias WHERE id_noticia = ?",
            [id]
        );
        
        if (noticias.length === 0) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        
        // Validación: solo el autor puede editar
        if (noticias[0].autor_id !== autor_id) {
            return res.status(403).json({ error: "No tienes permiso para editar esta noticia" });
        }
        
        // Actualizar solo los campos que se proporcionen
        const updateFields = [];
        const params = [];
        
        if (titulo !== undefined) {
            updateFields.push("titulo = ?");
            params.push(titulo);
        }
        if (descripcion !== undefined) {
            updateFields.push("descripcion = ?");
            params.push(descripcion);
        }
        if (contenido !== undefined) {
            updateFields.push("contenido = ?");
            params.push(contenido);
        }
        if (categoria !== undefined) {
            updateFields.push("categoria = ?");
            params.push(categoria);
        }
        if (ruta_imagen !== undefined && ruta_imagen !== null) {
            updateFields.push("ruta_imagen = ?");
            params.push(ruta_imagen);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No hay campos para actualizar" });
        }
        
        params.push(id);
        
        const query = `UPDATE noticias SET ${updateFields.join(", ")} WHERE id_noticia = ?`;
        const [result] = await db.query(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Noticia no encontrada" });
        }
        
        console.log("✅ Noticia actualizada");
        res.json({ success: true, message: "Noticia actualizada" });
    } catch (err) {
        console.error("❌ Error actualizando noticia:", err);
        res.status(500).json({ error: "Error al actualizar noticia", details: err.message });
    }
};