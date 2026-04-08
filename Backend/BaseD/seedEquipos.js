require("dotenv").config();
const fetch = require("node-fetch");
const { db } = require("./connection");

/* Este código genera un conjunto de equipos descargándolos a traves de la API de API-SPORTS. Es decir, los consigue en la web y los trae
a la base de datos para ser utilizados. Lamentablemente, no viene con valores análiticos, que se agreagn aritificalmente., */

const LIGAS = [
  { nombre: "La Liga", id: 140 },
  { nombre: "Premier League", id: 39 },
  { nombre: "Bundesliga", id: 78 }
];

async function cargarEquipos() {
  try {
    for (const liga of LIGAS) {
      const url = `https://v3.football.api-sports.io/teams?league=${liga.id}&season=2023`;

      console.log(`\n📌 Obteniendo equipos de ${liga.nombre}...`);

      const response = await fetch(url, {
        headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY }
      });

      const data = await response.json();

      if (!data.response || data.response.length === 0) {
        console.log("❌ No se recibió data de la API:", data);
        continue;
      }

      for (const item of data.response) {
        if (!item.team) continue;

        const { id, name, logo } = item.team;

        // -------------------------------
        // Generación de valores aleatorios
        // -------------------------------
        const stats = {
          Elo: Math.random() * 2000,
          Form3: Math.random() * 3,
          Form5: Math.random() * 5,

          Shots_last3_sum: Math.random() * 30,
          Target_last3_sum: Math.random() * 15,
          Fouls_last3_sum: Math.random() * 30,
          Corners_last3_sum: Math.random() * 15,
          Yellow_last3_sum: Math.random() * 5,
          Red_last3_sum: Math.random() * 2,
          GoalsFor_last3_sum: Math.random() * 10,
          GoalsAgainst_last3_sum: Math.random() * 10,

          Shots_last3_mean: Math.random() * 10,
          Target_last3_mean: Math.random() * 5,
          Fouls_last3_mean: Math.random() * 10,
          Corners_last3_mean: Math.random() * 5,
          Yellow_last3_mean: Math.random() * 2,
          Red_last3_mean: Math.random(),
          GoalsFor_last3_mean: Math.random() * 4,
          GoalsAgainst_last3_mean: Math.random() * 4,
        };

        try {
          await db.query(
            `INSERT IGNORE INTO equipos (
              id_equipo, nombre, liga, logo,
              Elo, Form3, Form5,
              Shots_last3_sum, Target_last3_sum, Fouls_last3_sum, Corners_last3_sum,
              Yellow_last3_sum, Red_last3_sum, GoalsFor_last3_sum, GoalsAgainst_last3_sum,
              Shots_last3_mean, Target_last3_mean, Fouls_last3_mean, Corners_last3_mean,
              Yellow_last3_mean, Red_last3_mean, GoalsFor_last3_mean, GoalsAgainst_last3_mean
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              id, name, liga.nombre, logo,
              stats.Elo, stats.Form3, stats.Form5,
              stats.Shots_last3_sum, stats.Target_last3_sum, stats.Fouls_last3_sum, stats.Corners_last3_sum,
              stats.Yellow_last3_sum, stats.Red_last3_sum, stats.GoalsFor_last3_sum, stats.GoalsAgainst_last3_sum,
              stats.Shots_last3_mean, stats.Target_last3_mean, stats.Fouls_last3_mean, stats.Corners_last3_mean,
              stats.Yellow_last3_mean, stats.Red_last3_mean, stats.GoalsFor_last3_mean, stats.GoalsAgainst_last3_mean
            ]
          );

          console.log(`✔ Insertado: ${name}`);
        } catch (err) {
          console.error(`❌ Error insertando ${name}:`, err.message);
        }
      }
    }

    console.log("\n🎉 ¡Equipos insertados correctamente!");

  } catch (error) {
    console.error("❌ Error cargando equipos:", error);
  }
}

module.exports = { cargarEquipos };
