const express = require("express");
const initDB = require("./BaseD/initDB");
const cors = require("cors");
const datosAPI = require("./BaseD/seedEquipos");
const path = require("path");
const { seedPartidos } = require("./BaseD/seedPartidos");

const usuariosRoutes = require("./routes/usuarios");
const equiposRoutes = require("./routes/equipos");
const partidosRoutes = require("./routes/partidos");
const noticiasRoutes = require("./routes/noticias");
const seguidoresRoutes = require("./routes/seguidores");
const mensajesRoutes = require("./routes/mensajes");
const oraculoRoutes = require("./routes/oraculo");
const filesRoutes = require("./routes/files");

/* Archivo principal del servidor backend que inicializa Express, configura
   CORS y el manejo de JSON, y carga todas las rutas de la aplicación
   (usuarios, seguidores, mensajes, noticias, archivos, equipos y partidos).
   También enlaza la carpeta pública para contenido estático y ejecuta la
   inicialización de la base de datos antes de arrancar el servidor.
   Este script actúa como punto central que organiza y arranca toda la API. */

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/partidos", partidosRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/seguidores", seguidoresRoutes);
app.use("/api/mensajes", mensajesRoutes);
app.use("/api/oracle", oraculoRoutes);
app.use("/api/files", filesRoutes);

app.use(express.static(path.join(__dirname, "./public")));

(async () => {
  console.log("⏳ Inicializando base de datos...");
  await initDB(); // crea DB + corre init.sql

  console.log("⬇️ Insertando equipos desde API...");
  await datosAPI.cargarEquipos();

  console.log("⚽ Insertando partidos por defecto...");
  await seedPartidos();

  console.log("🚀 Iniciando servidor...");
  app.listen(3001, () => console.log("Servidor en puerto 3001"));
})();