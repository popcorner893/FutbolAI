import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "../HojasEstilo/LoginPage.css";
import axios from "axios";

/* Componente LoginPage: gestiona inicio de sesión y registro en un solo formulario.
Incluye validación de correo, control de visibilidad de contraseñas y verificación
mediante reCAPTCHA. Usa AuthContext para ejecutar login() y register(), y redirige
al usuario tras autenticarse. El modo de registro agrega campos adicionales y valida
coincidencia de contraseñas. También incorpora un modal para recuperación de contraseña,
el cual envía la solicitud al backend mediante axios. Controla errores, navegación y
presentación dinámica entre modos de acceso y registro. */


const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null);

  // Campos generales
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app";

  const handleCaptcha = (value) => setCaptchaValue(value);

  // Validar dominio
  const emailValido = (correo) => {
    return (
      correo.endsWith("@gmail.com") ||
      correo.endsWith("@outlook.com") ||
      correo.endsWith("@hotmail.com")
    );
  };

  const togglePassword = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPassword = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const cambiarModoRegistro = () => {
    setIsRegisterMode(true);
    setError(null);
  };

  const cambiarModoLogin = () => {
    setIsRegisterMode(false);
    setError(null);
    setEmail('')
    setPassword('')
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setError("⚠️ Por favor, completa el CAPTCHA antes de continuar.");
      return;
    }

    if (!isRegisterMode) {
      // LOGIN NORMAL
      const success = await login(email, password);

      if (success) {
        alert("✅ Inicio de sesión exitoso");
        navigate(from, { replace: true });
      } else {
        setError("❌ Usuario o contraseña incorrectos");
      }
      return;
    }

    // REGISTRO
    if (!emailValido(email)) {
      alert("❌ El correo debe terminar en @gmail.com, @outlook.com o @hotmail.com");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    const success = await register(nombre, email, password);

    if (success) {
      alert("✅ Registro exitoso");
      cambiarModoLogin();
    } else {
      alert("❌ No se pudo registrar el usuario");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isRegisterMode ? "Regístrese" : "Inicia Sesión"}</h1>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="form-container">
          <div className="form-left">

            {/* Nombre solo si está registrando */}
            {isRegisterMode && (
              <>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  required
                />
              </>
            )}

            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo"
              required
            />

            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />

              <button
                type="button"
                className="toggle-pass-btn"
                onClick={togglePassword}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirmar Contraseña SOLO en registro */}
            {isRegisterMode && (
              <>
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="password-field">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita su contraseña"
                    required
                  />

                  <button
                    type="button"
                    className="toggle-pass-btn"
                    onClick={toggleConfirmPassword}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </>
            )}

            {/* En Login, mostrar "¿Olvidaste tu contraseña?" */}
            {!isRegisterMode && (
              <p
              className="forgot-text"
              data-bs-toggle="modal"
              data-bs-target="#forgotModal"
            >
              ¿Olvidaste tu contraseña?
            </p>

            )}
          </div>

          {/* Lado derecho */}
          <div className="form-right">
            {!isRegisterMode ? (
              <>
                <h3>¿No tiene una cuenta?</h3>
                <button
                  type="button"
                  className="btn-register"
                  onClick={cambiarModoRegistro}
                >
                  Regístrese
                </button>
              </>
            ) : (
              <>
                <h3>¿Ya tiene una cuenta?</h3>
                <button
                  type="button"
                  className="btn-register"
                  onClick={cambiarModoLogin}
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>
        </form>

        <hr />

        {/* Captcha */}
        <div className="captcha-container">
          <ReCAPTCHA
            sitekey="6LeF_fYrAAAAAP-gbGqBdJzWsWj-sUnrBIeqoDtN"
            onChange={handleCaptcha}
          />
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <button className="btn-login" type="submit" onClick={handleLogin}>
          {isRegisterMode ? "Regístrese" : "Iniciar Sesión"}
        </button>

        <div className="links">
          <Link to="/">Volver al inicio</Link> •{" "}
          <a href="#">Términos y Condiciones</a> -{" "}
          <a href="#">Política de Privacidad</a>
        </div>
      </div>

      {/* Modal Recuperación de Contraseña */}
      <div
        className="modal"
        id="forgotModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Recuperar Contraseña</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Ingrese su correo electrónico.  
                Si está registrado, recibirá una nueva contraseña.
              </p>

              <div>
                <label htmlFor="forgot-email" className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="forgot-email"
                  placeholder="usuario@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={async () => {
                  console.log("CLICK DETECTADO"); // <-- prueba obligatoria

                  const email = document.getElementById("forgot-email").value;

                  if (!email) {
                    alert("Por favor, ingresa un correo válido.");
                    return;
                  }

                  try {
                    await axios.post("http://localhost:3001/api/usuarios/forgot-password", {
                      email,
                    });

                    alert("Si el correo está registrado, se ha enviado una nueva contraseña.");
                  } catch (error) {
                    console.error("ERROR FRONT:", error);
                    alert("Error enviando petición. Revisa la consola.");
                  }
                }}
              >
                Enviar
              </button>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
};

export default LoginPage;






