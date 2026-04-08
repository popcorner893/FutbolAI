const Groq = require("groq-sdk");
const { db } = require("../BaseD/connection");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* Script oraculoController.js:
   Este controlador recibe preguntas en lenguaje natural y usa Groq para
   generar dinámicamente una consulta SQL basada en el esquema de la BD.
   oracleQuery: convierte la pregunta del usuario en SQL, ejecuta la consulta,
   y luego genera una respuesta final amigable según los resultados obtenidos.
   Incluye validaciones, manejo de errores y registros detallados en consola.
   getEquipos: consulta y devuelve la lista de equipos ordenados por liga.
   En resumen, este archivo implementa el “Oráculo”: un puente entre lenguaje
   natural, SQL y respuestas descriptivas generadas por IA. */


exports.oracleQuery = async (req, res) => {
  const userMessage = req.body.message;

  console.log("\n==============================");
  console.log("📩 PETICIÓN ORÁCULO RECIBIDA");
  console.log("==============================");
  console.log("Mensaje del usuario:", userMessage);

  try {
    console.log("\n⚙️ Generando prompt SQL...");
    const promptSQL = `
Eres un generador SQL experto. El usuario hace una pregunta en lenguaje natural.
Tu único trabajo es generar UNA consulta SQL válida basándote en el esquema dado, pero de forma robusta.

REGLAS IMPORTANTES:
- Si el usuario menciona nombres de equipos, ligas o jugadores que puedan NO coincidir exactamente con la BD, usa búsquedas flexibles:
  - LOWER(columna) LIKE LOWER('%texto_del_usuario%')
- Permite coincidencias parciales.
- Evita igualdad exacta a menos que sea obvio.
- Evita inyecciones: nunca incluyas comillas sin sanitizar.
- SIEMPRE devuelve una sola consulta SQL, sin comentarios ni texto adicional.
- Usa LIMIT 1 cuando la pregunta espere un único resultado.
- Si el usuario pregunta por un equipo, asume que se busca en la tabla "equipos".

ESQUEMA DE LA BASE DE DATOS:

CREATE DATABASE IF NOT EXISTS futbol_ai;
USE futbol_ai;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
    id_equipo INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    liga VARCHAR(100),
    logo VARCHAR(255),

    -- Nuevas columnas
    Elo FLOAT DEFAULT 0,
    Form3 FLOAT DEFAULT 0,
    Form5 FLOAT DEFAULT 0,

    Shots_last3_sum FLOAT DEFAULT 0,
    Target_last3_sum FLOAT DEFAULT 0,
    Fouls_last3_sum FLOAT DEFAULT 0,
    Corners_last3_sum FLOAT DEFAULT 0,
    Yellow_last3_sum FLOAT DEFAULT 0,
    Red_last3_sum FLOAT DEFAULT 0,
    GoalsFor_last3_sum FLOAT DEFAULT 0,
    GoalsAgainst_last3_sum FLOAT DEFAULT 0,

    Shots_last3_mean FLOAT DEFAULT 0,
    Target_last3_mean FLOAT DEFAULT 0,
    Fouls_last3_mean FLOAT DEFAULT 0,
    Corners_last3_mean FLOAT DEFAULT 0,
    Yellow_last3_mean FLOAT DEFAULT 0,
    Red_last3_mean FLOAT DEFAULT 0,
    GoalsFor_last3_mean FLOAT DEFAULT 0,
    GoalsAgainst_last3_mean FLOAT DEFAULT 0
);


-- Tabla de partidos
CREATE TABLE IF NOT EXISTS partidos (
    id_partido INT AUTO_INCREMENT PRIMARY KEY,
    equipo_local_id INT NOT NULL,
    equipo_visitante_id INT NOT NULL,
    fecha DATETIME,
    marcador_local INT DEFAULT 0,
    marcador_visitante INT DEFAULT 0,
    FOREIGN KEY (equipo_local_id) 
        REFERENCES equipos(id_equipo)
        ON DELETE CASCADE,
    FOREIGN KEY (equipo_visitante_id) 
        REFERENCES equipos(id_equipo)
        ON DELETE CASCADE
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    contenido LONGTEXT,
    ruta_imagen LONGTEXT,
    autor_id INT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- Tabla seguidores
CREATE TABLE IF NOT EXISTS seguidores (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    seguidor_id INT NOT NULL,
    seguido_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seguidor_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (seguido_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    UNIQUE(seguidor_id, seguido_id)
);

-- Tabla mensajes
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    texto TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);
IMPORTANTE:
Devuelve SOLO la consulta SQL. Nada más.

Pregunta del usuario: "${userMessage}"

`;

    console.log("\n🧠 Enviando promptSQL al modelo...");
    const sqlResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: promptSQL }],
      temperature: 0
    });

    const sql = sqlResponse.choices[0].message.content;

    console.log("\n📜 SQL GENERADO:");
    console.log(sql);

    console.log("\n🗄 Ejecutando SQL en MySQL...");
    const [rows] = await db.query(sql);

    console.log("\n📦 RESULTADOS MYSQL:");
    console.log(rows);

    console.log("\n⚙️ Preparando prompt de respuesta final...");
    const promptFormat = `
"El Oráculo", una inteligencia artificial de fútbol.
El usuario preguntó: "${userMessage}"
Resultados en JSON: ${JSON.stringify(rows)}

Redacta una respuesta clara, bonita y amigable SÓLO con lo que encuentres en el JSON que recibiste. No imagines nada. Sin embargo, si recibes un saludo, debes presentarte como El Oráculo,
un chatbot de IA, y omitir los resultados de la consulta SQL.  
`;

    console.log("\n🧠 Enviando promptFormat al modelo...");
    const finalResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: promptFormat }],
    });

    const reply = finalResponse.choices[0].message.content;

    console.log("\n🔮 RESPUESTA DEL ORÁCULO:");
    console.log(reply);

    console.log("\n==============================");
    console.log("✅ ORÁCULO RESPONDIÓ CORRECTAMENTE");
    console.log("==============================\n");

    return res.json({ reply });

  } catch (err) {
    console.error("\n❌ ERROR EN ORÁCULO:");
    console.error(err);
    console.log("\n==============================");
    console.log("❌ FIN DEL ERROR");
    console.log("==============================\n");

    res.status(500).json({ reply: "El Oráculo no puede responder por ahora..." });
  }
};



exports.getEquipos = async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT nombre AS team, liga, logo
        FROM equipos
        ORDER BY liga, nombre
        `);

        res.json({ ok: true, equipos: rows });
    } catch (err) {
        console.error("ERROR obteniendo equipos:", err);
        res.status(500).json({ ok: false, error: "Error interno" });
    }
}



