import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Dropdown } from "bootstrap"
import { FiX, FiSend } from "react-icons/fi";
import "../HojasEstilo/PublicLayout.css"; 
import Fondo_Banner_Oscuro from "../Multimedia/Fondo_banner.png";
import User_Icon from "../Multimedia/User.png";
import Logo_Vertical from "../Multimedia/Logo_Vertical.png";
import { FiLogOut, FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";
import Ivan from "/Ivan.jpg";
import Sofia from "/Sofia.jpg";
import Andres from "/Andres.jpg";

/* Estructura principal para las vistas privadas del sistema. Controla navegación,
cierre de sesión y renderizado dinámico mediante Outlet. Incluye un menú con
opciones visibles según el rol del usuario y un footer con equipo y redes.
Implementa un chat flotante llamado “Oráculo”, manejando su apertura, mensajes,
formato y comunicación con el backend mediante axios. Usa useEffect para iniciar
componentes Bootstrap como dropdowns y mantiene estados locales para el panel del
Oráculo. Centraliza toda la interfaz privada, actuando como layout general. */


const PrivateLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();



  useEffect(() => {
    document
      .querySelectorAll('[data-bs-toggle="dropdown"]')
      .forEach((el) => new Dropdown(el));
  }, []);


  const [oracleOpen, setOracleOpen] = useState(false);
  const [oracleInput, setOracleInput] = useState("");
  const [oracleMessages, setOracleMessages] = useState([]);

  const formatMessage = (text) => {
  if (!text) return "";

  // negritas **texto**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return formatted;
  };


  const sendMessage = async () => {
    if (!oracleInput.trim()) return;

    const userText = oracleInput.trim();

    setOracleMessages(prev => [...prev, { from: "user", text: userText }]);
    setOracleInput("");

    try {
      const res = await axios.post("http://localhost:3001/api/oracle/query", {
        message: userText
      });

      setOracleMessages(prev => [
        ...prev,
        { from: "bot", text: res.data.reply }
      ]);

    } catch (err) {
      console.error(err);
      setOracleMessages(prev => [
        ...prev,
        { from: "bot", text: "El Oráculo no puede responder ahora..." }
      ]);
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="public-layout">
      {/* === Header === */}
      <header className="zona-superior">
        <div className="header-logo-center">
          <div className="header-logo-container">
            <Link to="/app" className="logo-link">
              <img src={Fondo_Banner_Oscuro} alt="Portal Deportivo" className="logo-img" />
            </Link>
          </div>
        </div>

        <button className="btn-cerrar-sesion" onClick={handleLogout}>
          <FiLogOut style={{ marginRight: "8px" }} />
          Cerrar sesión
        </button>
      </header>

      {/* === Menú principal === */}
      <nav className="zona-menu">
        <NavLink to="/app/partidos" className={({ isActive }) => (isActive ? "activo" : "")}>
          Programación de Partidos
        </NavLink>
        <NavLink to="/app/noticias" className={({ isActive }) => (isActive ? "activo" : "")}>
          Noticias
        </NavLink>
        <NavLink to="/app/oraculo" className={({ isActive }) => (isActive ? "activo" : "")}>
          Oráculo
        </NavLink>
        <NavLink to="/app/centro-social" className={({ isActive }) => (isActive ? "activo" : "")}>
          Centro Social
        </NavLink>
        <NavLink to="/app/tabla-de-posiciones" className={({ isActive }) => (isActive ? "activo" : "")}>
          Tabla de Posiciones
        </NavLink>

        {/* === Dropdown "Más" === */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Más
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><Link className="dropdown-item" to="/app/tablero">Tablero</Link></li>
            {user?.rol === 'admin' && (
              <>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/app/admin-noticias">📰 Administrar Noticias</Link></li>
                <li><Link className="dropdown-item" to="/app/admin-usuarios">🕴 Administrar Usuarios</Link></li>
                <li><Link className="dropdown-item" to="/app/admin-equipos">🚩 Administrar Equipos</Link></li>
                <li><Link className="dropdown-item" to="/app/admin-partidos">⚽ Administrar Partidos</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/app/files">📁 Archivos del Servidor</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>


      {/* === Contenido Principal === */}
      <main className="zona-principal">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-column">
          <div className="footer-logo-container">
            <img
              src={Logo_Vertical}
              alt="Logo Vertical"
              className="footer-logo"
            />
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-title">Síguenos en Nuestras redes sociales</p>
          <div className="footer-social-icons">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-title">Equipo de Desarrollo</p>
          <button
            type="button"
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target="#teamModal"
          >
            Ver
          </button>

          {/* Modal */}
          <div className="modal fade" id="teamModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Equipo de Desarrollo</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                  <div className="team-grid">
                  {/* Footer */}
                  <div className="team-member">
                    <img src={Ivan} alt="Integrante 1" />
                    <p>Iván Camargo</p>
                    <p>2230033</p>
                    <p>ivan2230033@correo.uis.edu.co</p>
                    <div className="social-icons">
                      <FiFacebook /><FiTwitter /><FiInstagram />
                    </div>
                  </div>
                  <div className="team-member">
                    <img src={Sofia} alt="Integrante 2" />
                    <p>Sofía Vega</p>
                    <p>2230041</p>
                    <p>sofia2230041@correo.uis.edu.co</p>
                    <div className="social-icons">
                      <FiFacebook /><FiTwitter /><FiInstagram />
                    </div>
                  </div>
                  <div className="team-member">
                      <img src={Andres} alt="Integrante 3" />
                      <p>Andrés García</p>
                      <p>2230089</p>
                      <p>andresgarcia120035@gmail.com</p>
                      <div className="social-icons">
                        <FiFacebook /><FiTwitter /><FiInstagram />
                      </div>
                    </div>
                  <div className="team-member">
                        <img src="/Nicolas.jpeg" alt="Integrante 4" />
                        <p>Nicolás Linares</p>
                        <p>2230027</p>
                        <p>nicolas2230027@correo.uis.edu.co</p>
                        <div className="social-icons">
                          <FiFacebook /><FiTwitter /><FiInstagram />
                        </div>
                      </div>
                  </div>
              </div>
              </div>
          </div>
          </div>
        </div>
      </footer>

      {/* === Burbuja Flotante del Oráculo === */}
      <div
        className="oraculo-floating-bubble"
        onClick={() => setOracleOpen(true)}
      >
        <span>Oráculo</span>
      </div>

      {/* === Chat del Oráculo === */}
      <div className={`oraculo-chatbox ${oracleOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>El Oráculo</h3>
          <button className="close-btn" onClick={() => setOracleOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        <div className="chat-messages">
          {oracleMessages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.from}`}
            >
              <img
                src={msg.from === "user" ? User_Icon : Logo_Vertical}
                className="chat-avatar"
                alt="avatar"
              />
              <div
                className="chat-bubble"
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              ></div>
            </div>
          ))}
        </div>


        <div className="chat-input-area">
          <input
            type="text"
            value={oracleInput}
            onChange={e => setOracleInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Haz tu consulta..."
          />

          <button onClick={sendMessage} className="send-btn">
            <FiSend size={18} />
          </button>
        </div>
      </div>




    </div>
  );
};

export default PrivateLayout;

