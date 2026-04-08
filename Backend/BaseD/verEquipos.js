//Código de prueba solamente para ver los equipos cargados en la base de datos

const {db} = require("./connection");

async function verEquipos() {
  const [rows] = await db.query("SELECT * FROM equipos");
  console.log(rows);
  db.end();
}

verEquipos();
