import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../HojasEstilo/PublicLayout.css"; 
import Fondo_Banner_Oscuro from "../Multimedia/Fondo_banner.png";
import Logo_Vertical from "../Multimedia/Logo_Vertical.png";
import { FiUser } from "react-icons/fi";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Ivan from "/Ivan.jpg";
import Sofia from "/Sofia.jpg";
import Andres from "/Andres.jpg";


/* PublicLayout: componente principal que define la estructura pública del sitio.
Incluye un encabezado con el logo y acceso al login, una barra de navegación
con enlaces a secciones como partidos, noticias y tabla de posiciones, y un
contenedor central donde se cargan las vistas hijas mediante <Outlet />.
También incorpora un footer con redes sociales y un modal que muestra al equipo
de desarrollo. Utiliza NavLink para resaltar la sección activa y recursos
gráficos importados para la interfaz. Sirve como plantilla base para todas las
páginas visibles sin autenticación. */



const PublicLayout = () => {

const navigate = useNavigate();

  return (
    <div className="public-layout">
      {/* === Header Superior === */}
      <header className="zona-superior">
        <div className="header-logo-center">
            <div className="header-logo-container">
            <Link to="/" className="logo-link">
                <img src={Fondo_Banner_Oscuro} alt="Portal Deportivo" className="logo-img" />
            </Link>
            </div>
        </div>

        <Link to="/login" className="btn-iniciar-sesion">
            <FiUser style={{ marginRight: "8px" }} />
            Iniciar sesión
            </Link>

        </header>




      {/* === Barra de Navegación === */}
      <nav className="zona-menu">
        <NavLink
          to="/partidos"
          className={({ isActive }) => (isActive ? "activo" : "")}
        >
          Programación de Partidos
        </NavLink>
        <NavLink
          to="/noticias"
          className={({ isActive }) => (isActive ? "activo" : "")}
        >
          Noticias
        </NavLink>
        <NavLink
          to="/oraculo-not-logged"
          className={({ isActive }) => (isActive ? "activo" : "")}
          >
          Oráculo
          </NavLink>
        <NavLink
          to="/tabla-de-posiciones"
          className={({ isActive }) => (isActive ? "activo" : "")}
        >
          Tabla de Posiciones
        </NavLink>
      </nav>

      {/* === Contenido Principal === */}
      <main className="zona-principal">
        <Outlet />
      </main>

    {/* Footer */ }

    <footer className="footer-container">
        {/* Columna 1: Logo */}
        <div className="footer-column">
            <div className="footer-logo-container">
            <img src={Logo_Vertical} alt="Logo Vertical" className="footer-logo" />
            </div>
        </div>

        {/* Columna 2: Redes sociales */}
        <div className="footer-column">
            <p className="footer-title">Síguenos en Nuestras redes sociales</p>
            <div className="footer-social-icons">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
            </div>
        </div>

        {/* Columna 3: Equipo de desarrollo */}
        <div className="footer-column">
            <p className="footer-title">Equipo de Desarrollo</p>
            <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#teamModal">
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


    </div>


  );
};

export default PublicLayout;
