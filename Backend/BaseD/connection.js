/* Archivo connection.js: configura la conexión a MySQL usando mysql2.
Carga las variables de entorno desde .env y crea dos pools de conexión:
uno sin base de datos seleccionada (poolNoDB) y otro con la BD definida (db),
usados para tareas como creación de tablas o consultas normales. Ambos pools
permiten múltiples conexiones simultáneas y soportan múltiples sentencias.
Se exportan como promesas para usar async/await en el backend. */



const mysql = require("mysql2");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Pool con database ya definida (para inserts, selects, etc.)
const poolConDB = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

module.exports = {
  poolNoDB: pool.promise(),
  db: poolConDB.promise()
};