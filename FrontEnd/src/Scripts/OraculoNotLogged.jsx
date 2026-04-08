import React from "react";
import { useNavigate } from "react-router-dom";
import "../HojasEstilo/OraculoNotLogged.css";

/* Componente que restringe el acceso al oráculo cuando el usuario no ha iniciado
sesión. Emplea useNavigate para redirigir al formulario de login mediante la
función handleLoginRedirect. Muestra un mensaje informativo y un botón que
conduce directamente a la autenticación. Funciona como pantalla de bloqueo para
secciones protegidas del sistema, reforzando el flujo de navegación y control
de acceso dentro de la aplicación. */


const OraculoNotLogged = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  //Incita al usuario al iniciar sesión, solo está disponible si la ha iniciado. 

  return (
    <div className="oraculo-not-logged-container">
      <div className="oraculo-not-logged-card">
        <h2 className="oraculo-not-logged-title">
          Para utilizar el oráculo, inicia sesión
        </h2>
        <button
          className="oraculo-not-logged-button"
          onClick={handleLoginRedirect}
        >
          Ir a iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default OraculoNotLogged;

