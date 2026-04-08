import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

/* Este contexto maneja toda la lógica de autenticación de la aplicación.
useAuth() permite acceder al usuario y funciones de login/logout desde cualquier componente.
Al iniciar, recupera la sesión desde localStorage para mantener al usuario conectado.
login(): envía email y password al backend y guarda el usuario autenticado.
register(): crea un nuevo usuario llamando a la API correspondiente.
logout(): elimina la sesión tanto del estado como de localStorage.
El provider expone user, estado de carga y funciones para gestionar la autenticación.
*/


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mantener la sesión desde localStorage al recargar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN REAL: llama al backend para autenticar
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:3001/api/usuarios/login", {
        email,
        password,
      });


      const loggedUser = res.data;

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      return true; // login exitoso
    } catch (error) {
      console.error("Error en login:", error);
      return false; // credenciales incorrectas o error backend
    }
  };

  const register = async (nombre, email, password) => {
    try {
      const res = await axios.post("http://localhost:3001/api/usuarios/register", {
        nombre,
        email,
        password,
      });

      return true; // registro exitoso
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };


  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

 

