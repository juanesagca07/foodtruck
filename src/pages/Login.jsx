import { useRef, useState } from "react";
import toast from "react-hot-toast";

import logo from "../assets/img/logo.png";
import { loginUsuario } from "../services/authService";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const passwordRef = useRef(null);

  const validarLogin = async () => {
    try {
      setError("");
      setCargando(true);

      const usuarioLimpio = usuario.trim();
      const passwordLimpio = password.trim();

      if (!usuarioLimpio || !passwordLimpio) {
        setError("Debes ingresar usuario y contraseña");
        toast.error("Completa usuario y contraseña");
        return;
      }

      const respuesta = await loginUsuario({
        usuario: usuarioLimpio,
        password: passwordLimpio,
      });

      localStorage.setItem("token", respuesta.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

      toast.success("Bienvenido al sistema");
      onLogin(respuesta.usuario);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Usuario o contraseña incorrectos");
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  const manejarEnterUsuario = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  const manejarEnterPassword = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validarLogin();
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <img src={logo} alt="Logo FoodTruck" className="login-logo" />

        <h1>FOODTRUCK</h1>
        <p>Sistema de gestión para comidas rápidas</p>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          onKeyDown={manejarEnterUsuario}
          autoFocus
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={manejarEnterPassword}
        />

        {error && <span className="error-text">{error}</span>}

        <button
          className="primary-btn login-submit-btn"
          onClick={validarLogin}
          disabled={cargando}
        >
          {cargando ? "Ingresando..." : "Ingresar al sistema"}
        </button>
      </section>
    </main>
  );
}

export default Login;