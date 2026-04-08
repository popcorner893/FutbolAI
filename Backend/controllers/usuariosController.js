const {db} = require("../BaseD/connection");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/* Controlador de usuarios:
   Administra el registro, inicio de sesión y recuperación de contraseña
   usando consultas a la base de datos. loginUsuario valida credenciales;
   registrarUsuario crea nuevos usuarios y verifica duplicados; forgotPassword
   genera una clave temporal y la envía por correo. Incluye funciones CRUD:
   listar, crear, actualizar, eliminar y buscarUsuarioPorNombre. También
   obtenerUno devuelve un usuario por ID. En conjunto, este script gestiona
   toda la lógica de usuarios para el sistema. */


exports.loginUsuario = async (req, res) => {

  console.log("➡️ Petición recibida en /api/usuarios/login:", req.body);

  const { email, password } = req.body;

  try {
    // Buscar usuario en BD
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, email, password, rol FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Comparar contraseñas con bcrypt
    const isMatch = password === usuario.password;
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Login exitoso
    res.json({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    console.log("📩 Petición de registro recibida:", req.body);

    // Validación simple
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el email ya existe
    const [existe] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario nuevo
    await db.query(
      `INSERT INTO usuarios (nombre, email, password, rol, fecha_registro)
       VALUES (?, ?, ?, 'usuario', NOW())`,
      [nombre, email, hashedPassword]
    );

    console.log("✅ Usuario registrado correctamente");

    // Respuesta al frontend
    res.json({ message: "Usuario registrado exitosamente" });

  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {

    console.log("Petición de cambio de contraseña recibida:", req.body);

    // 1. Verificar si el correo existe
    const [rows] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      // Para no revelar información, devolvemos OK igual
      return res.json({ ok: true });
    }

    const user = rows[0];

    // 2. Generar nueva contraseña temporal
    const nueva = Math.random().toString(36).slice(-8);

    await db.query(
    "UPDATE usuarios SET password = ? WHERE id_usuario = ?",
    [nueva, user.id_usuario]  // <-- guardar la contraseña tal cual
    );


    // 4. Enviar correo
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App password
    },
    tls: {
    rejectUnauthorized: false, // <--- importante
  }
    });

    const email_options = {
      from: process.env.MAIL_USER ,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Su nueva contraseña temporal es:</p>
        <h2>${nueva}</h2>
        <p>Por favor, cámbiela después de iniciar sesión.</p>
      `,
    }


    transporter.sendMail(email_options, (error, info) =>{
        if (error) {
            return console.log(`Error ocurred`, error)
        }
        console.log(`Email sent successfully`, info.response)
    }
    )

    return res.json({ ok: true });

  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};


exports.crear = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, password]
    );

    res.json({ id: result.insertId });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    // Verificar si envió campos
    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ error: "No se enviaron datos para actualizar" });
    }

    // Validar que exista el usuario
    const [existe] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Construir SET dinámico
    const columnas = Object.keys(campos);
    const valores = Object.values(campos);

    const setSQL = columnas.map(c => `${c} = ?`).join(", ");

    const sql = `UPDATE usuarios SET ${setSQL} WHERE id_usuario = ?`;

    // Agregar id al final
    valores.push(id);

    await db.query(sql, valores);

    res.json({ message: "Usuario actualizado correctamente", actualizado: campos });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar usuario existente
    const [existe] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    if (existe.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};


exports.buscarUsuarioPorNombre = async (req, res) => {
    const { nombre } = req.query;

    console.log("🔍 Petición de búsqueda recibida. Nombre:", nombre);

    if (!nombre || nombre.trim() === "") {
        console.log("❌ Nombre vacío");
        return res.json([]);
    }

    try {
        // Usar COLLATE para ignorar mayúsculas/minúsculas
        const query = "SELECT id_usuario, nombre, email FROM usuarios WHERE nombre LIKE ? COLLATE utf8mb4_general_ci";
        const params = [`%${nombre}%`];
        
        console.log("📊 Query:", query);
        console.log("🔤 Parámetros:", params);
        
        const [rows] = await db.query(query, params);
        
        console.log("✅ Resultados encontrados:", rows.length);
        res.json(rows);
    } catch (err) {
        console.error("❌ Error buscando usuarios:", err);
        res.status(500).json({ error: "Error en servidor", details: err.message });
    }
};

exports.obtenerUno = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};