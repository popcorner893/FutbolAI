/* Script initdb.js: inicializa la base de datos leyendo el archivo init.sql,
separando sus sentencias y ejecutándolas una por una. Crea la BD si no existe,
luego selecciona "futbol_ai" y continúa con la creación de tablas y datos.
Usa poolNoDB para ejecutar SQL sin requerir una BD previa. Al finalizar,
muestra en consola si la inicialización fue exitosa o si ocurrió algún error. */


const fs = require("fs");
const path = require("path");
const {poolNoDB} = require("./connection");

async function initDB() {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const raw = fs.readFileSync(sqlPath, "utf8");

    const statements = raw
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {

      if (stmt.toUpperCase().startsWith("CREATE DATABASE")) {
        console.log("Creando BD...");
        await poolNoDB.query(stmt + ";");

        console.log("Seleccionando BD...");
        await poolNoDB.query("USE futbol_ai;");
        continue;
      }

      console.log("Ejecutando:", stmt.slice(0, 60), "...");
      await poolNoDB.query(stmt + ";");
    }

    console.log("✅ Base de datos inicializada correctamente.");
  } catch (err) {
    console.error("❌ Error inicializando la BD:", err);
  }
}

module.exports = initDB;
