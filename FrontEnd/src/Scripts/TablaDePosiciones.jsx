import React, { useState } from "react";
import StandingsTable from "./StandingsTable";
import "../HojasEstilo/TablaDePosiciones.css";

/* Componente TablaDePosiciones: renderiza la vista de clasificación por ligas.
Utiliza useState para almacenar la liga seleccionada y permite cambiarla mediante
un <select>. El objeto 'leagues' define las ligas disponibles para mostrar.
Cada vez que el usuario elige una liga, se actualiza el estado y se reconstruye
la tabla correspondiente. El componente StandingsTable recibe la liga activa
como prop y muestra su respectiva tabla de posiciones. Sirve como interfaz
principal para consultar standings de diferentes competiciones. */


export default function TablaDePosiciones() {
  const [selectedLeague, setSelectedLeague] = useState("laliga");

  const leagues = {
    laliga: "LaLiga",
    premier: "Premier League",
    bundesliga: "Bundesliga",
  };

  //Acá si, se reconstruyen cada una de las tablas para cada elección. 

  return (
    <div className="standings-container">
      <h1>🏆 Tablas de Posiciones</h1>

      <div className="select-league">
        <label htmlFor="league">Selecciona una liga:</label>
        <select
          id="league"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          {Object.entries(leagues).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <StandingsTable league={selectedLeague} />
    </div>
  );
}
