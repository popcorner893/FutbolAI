import React from "react";
import "../HojasEstilo/TablaDePosiciones.css";

export default function StandingsTable({ league }) {
  const data = {

    //Documenta algunos valores de posiciones


    laliga: [
      { name: "Real Madrid", played: 10, won: 9, drawn: 0, lost: 1, gf: 22, ga: 10, gd: 12, points: 27 },
      { name: "Barcelona", played: 10, won: 7, drawn: 1, lost: 2, gf: 25, ga: 12, gd: 13, points: 22 },
      { name: "Villarreal", played: 10, won: 6, drawn: 2, lost: 2, gf: 18, ga: 10, gd: 8, points: 20 },
      { name: "Espanyol", played: 10, won: 5, drawn: 3, lost: 2, gf: 14, ga: 11, gd: 3, points: 18 },
      { name: "Atletico Madrid", played: 9, won: 4, drawn: 4, lost: 1, gf: 16, ga: 10, gd: 6, points: 16 },
      { name: "Real Betis", played: 9, won: 4, drawn: 4, lost: 1, gf: 15, ga: 10, gd: 5, points: 16 },
      { name: "Elche", played: 10, won: 3, drawn: 5, lost: 2, gf: 11, ga: 10, gd: 1, points: 14 },
      { name: "Athletic Club", played: 10, won: 4, drawn: 2, lost: 4, gf: 9, ga: 10, gd: -1, points: 14 },
      { name: "Getafe", played: 10, won: 4, drawn: 2, lost: 4, gf: 10, ga: 12, gd: -2, points: 14 },
      { name: "Sevilla FC", played: 10, won: 4, drawn: 1, lost: 5, gf: 17, ga: 16, gd: 1, points: 13 },
      { name: "Alaves", played: 9, won: 3, drawn: 3, lost: 3, gf: 9, ga: 8, gd: 1, points: 12 },
      { name: "Rayo Vallecano", played: 9, won: 3, drawn: 2, lost: 4, gf: 11, ga: 10, gd: 1, points: 11 },
      { name: "Osasuna", played: 9, won: 3, drawn: 1, lost: 5, gf: 7, ga: 9, gd: -2, points: 10 },
      { name: "Levante", played: 10, won: 2, drawn: 3, lost: 5, gf: 14, ga: 18, gd: -4, points: 9 },
      { name: "Mallorca", played: 10, won: 2, drawn: 3, lost: 5, gf: 11, ga: 15, gd: -4, points: 9 },
      { name: "Real Sociedad", played: 10, won: 2, drawn: 3, lost: 5, gf: 10, ga: 14, gd: -4, points: 9 },
      { name: "Valencia", played: 10, won: 2, drawn: 3, lost: 5, gf: 10, ga: 16, gd: -6, points: 9 },
      { name: "Celta Vigo", played: 9, won: 0, drawn: 7, lost: 2, gf: 8, ga: 11, gd: -3, points: 7 },
      { name: "Real Oviedo", played: 10, won: 2, drawn: 1, lost: 7, gf: 7, ga: 19, gd: -12, points: 7 },
      { name: "Girona", played: 10, won: 1, drawn: 4, lost: 5, gf: 9, ga: 22, gd: -13, points: 7 },
    ],

    premier: [
      { name: "Arsenal", played: 9, won: 7, drawn: 1, lost: 1, gf: 16, ga: 3, gd: 13, points: 22 },
      { name: "AFC Bournemouth", played: 9, won: 5, drawn: 3, lost: 1, gf: 16, ga: 11, gd: 5, points: 18 },
      { name: "Tottenham Hotspur", played: 9, won: 5, drawn: 2, lost: 2, gf: 17, ga: 7, gd: 10, points: 17 },
      { name: "Sunderland", played: 9, won: 5, drawn: 2, lost: 2, gf: 11, ga: 7, gd: 4, points: 17 },
      { name: "Manchester City", played: 9, won: 5, drawn: 1, lost: 3, gf: 17, ga: 7, gd: 10, points: 16 },
      { name: "Manchester United", played: 9, won: 5, drawn: 1, lost: 3, gf: 15, ga: 14, gd: 1, points: 16 },
      { name: "Liverpool", played: 9, won: 5, drawn: 0, lost: 4, gf: 16, ga: 14, gd: 2, points: 15 },
      { name: "Aston Vila", played: 9, won: 4, drawn: 3, lost: 2, gf: 9, ga: 8, gd: 1, points: 15 },
      { name: "Chelsea", played: 9, won: 4, drawn: 2, lost: 3, gf: 17, ga: 11, gd: 6, points: 14 },
      { name: "Crystal Palace", played: 9, won: 3, drawn: 4, lost: 2, gf: 12, ga: 9, gd: 3, points: 13 },
      { name: "Brentford", played: 9, won: 4, drawn: 1, lost: 4, gf: 14, ga: 14, gd: 0, points: 13 },
      { name: "Newcastle United", played: 9, won: 3, drawn: 3, lost: 3, gf: 9, ga: 8, gd: 1, points: 12 },
      { name: "Brighton & Hove Albion", played: 9, won: 3, drawn: 3, lost: 3, gf: 14, ga: 15, gd: -1, points: 12 },
      { name: "Everton", played: 9, won: 3, drawn: 2, lost: 4, gf: 9, ga: 12, gd: -3, points: 11 },
      { name: "Leeds United", played: 9, won: 3, drawn: 2, lost: 4, gf: 9, ga: 14, gd: -5, points: 11 },
      { name: "Burnley", played: 9, won: 3, drawn: 1, lost: 5, gf: 12, ga: 17, gd: -5, points: 10 },
      { name: "Fulham", played: 9, won: 2, drawn: 2, lost: 5, gf: 9, ga: 14, gd: -5, points: 8 },
      { name: "Nottingham Forest", played: 9, won: 1, drawn: 2, lost: 6, gf: 5, ga: 17, gd: -12, points: 5 },
      { name: "West Ham United", played: 9, won: 1, drawn: 1, lost: 7, gf: 7, ga: 20, gd: -13, points: 4 },
      { name: "Wolverhampton", played: 9, won: 0, drawn: 2, lost: 7, gf: 7, ga: 19, gd: -12, points: 2 },
    ],

    bundesliga: [
      { name: "Bayern Munich", played: 8, won: 8, drawn: 0, lost: 0, gf: 30, ga: 4, gd: 26, points: 24 },
      { name: "RB Leipzig", played: 8, won: 6, drawn: 1, lost: 1, gf: 16, ga: 9, gd: 7, points: 19 },
      { name: "VfB Stuttgart", played: 8, won: 6, drawn: 0, lost: 2, gf: 13, ga: 7, gd: 6, points: 18 },
      { name: "Borussia Dortmund", played: 8, won: 5, drawn: 2, lost: 1, gf: 14, ga: 6, gd: 8, points: 17 },
      { name: "Bayer Leverkusen", played: 8, won: 5, drawn: 2, lost: 1, gf: 18, ga: 11, gd: 7, points: 17 },
      { name: "Eintracht Frankfurt", played: 8, won: 4, drawn: 1, lost: 3, gf: 21, ga: 18, gd: 3, points: 13 },
      { name: "TSG Hoffenheim", played: 8, won: 4, drawn: 1, lost: 3, gf: 15, ga: 13, gd: 2, points: 13 },
      { name: "FC Cologne", played: 8, won: 3, drawn: 2, lost: 3, gf: 12, ga: 11, gd: 1, points: 11 },
      { name: "Werder Bremen", played: 8, won: 3, drawn: 2, lost: 3, gf: 12, ga: 16, gd: -4, points: 11 },
      { name: "FC Union Berlin", played: 8, won: 3, drawn: 1, lost: 4, gf: 11, ga: 15, gd: -4, points: 10 },
      { name: "SC Freiburg", played: 8, won: 2, drawn: 3, lost: 3, gf: 11, ga: 13, gd: -2, points: 9 },
      { name: "VfL Wolfsburg", played: 8, won: 2, drawn: 2, lost: 4, gf: 9, ga: 13, gd: -4, points: 8 },
      { name: "Hamburg SV", played: 8, won: 2, drawn: 2, lost: 4, gf: 7, ga: 11, gd: -4, points: 8 },
      { name: "St Pauli", played: 8, won: 2, drawn: 1, lost: 5, gf: 8, ga: 14, gd: -6, points: 7 },
      { name: "FC Augsburgo", played: 8, won: 2, drawn: 1, lost: 5, gf: 12, ga: 20, gd: -8, points: 7 },
      { name: "Mainz", played: 8, won: 1, drawn: 1, lost: 6, gf: 9, ga: 16, gd: -7, points: 4 },
      { name: "FC Heidenheim 1846", played: 8, won: 1, drawn: 1, lost: 6, gf: 7, ga: 16, gd: -9, points: 4 },
      { name: "Borussia Monchengladbach", played: 8, won: 0, drawn: 3, lost: 5, gf: 6, ga: 18, gd: -12, points: 3 },
    ],
  };

  const logoPaths = {
    premier: (team) => `/Logos/Premier_League/${team.replaceAll(" ", "_")}.png`,
    laliga: (team) => `/Logos/La_Liga/${team.replaceAll(" ", "_")}.png`,
    bundesliga: (team) => `/Logos/Bundesliga/${team.replaceAll(" ", "_")}.png`,
  };

 const leagueNames = {
    laliga: "LaLiga 2025/2026",
    premier: "Premier League 2025/2026",
    bundesliga: "Bundesliga 2025/2026",
  };

  const standings = data[league];

  // Equipos líderes (primeros de cada liga)
  const leaders = [
    {
      league: "LaLiga",
      name: data.laliga[0].name,
      logo: logoPaths.laliga(data.laliga[0].name),
    },
    {
      league: "Premier League",
      name: data.premier[0].name,
      logo: logoPaths.premier(data.premier[0].name),
    },
    {
      league: "Bundesliga",
      name: data.bundesliga[0].name,
      logo: logoPaths.bundesliga(data.bundesliga[0].name),
    },
  ];

  return (
    <div className="standings-table">
      <h2>{leagueNames[league]}</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>J</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DIF</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.name} className="hover-row">
              <td>{index + 1}</td>
              <td className="team-cell">
                <img
                  src={logoPaths[league](team.name)}
                  alt={team.name}
                  className="team-logo"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span>{team.name}</span>
              </td>
              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.drawn}</td>
              <td>{team.lost}</td>
              <td>{team.gf}</td>
              <td>{team.ga}</td>
              <td>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}