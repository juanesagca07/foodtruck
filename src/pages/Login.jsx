import { useState } from "react";

function Login({ iniciarSesion }) {

  const [usuario, setUsuario] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const usuarios = [

    {
      usuario: "admin",
      password: "1234",
      rol: "Administrador"
    },

    {
      usuario: "cajero",
      password: "1234",
      rol: "Cajero"
    },

    {
      usuario: "cocina",
      password: "1234",
      rol: "Cocina"
    }

  ];

  const validarLogin = () => {

    const encontrado = usuarios.find(

      (item) =>

        item.usuario === usuario
        &&
        item.password === password

    );

    if (!encontrado) {

      setError(
        "Usuario o contraseña incorrectos"
      );

      return;

    }

    setError("");

    iniciarSesion(encontrado);

  };

  return (

    <main className="login-page">

      <section className="login-card">

        <div className="brand-logo">

          🍔

        </div>

        <h1>

          FOODTRUCK

        </h1>

        <p>

          Sistema de gestión para comidas rápidas

        </p>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (

          <span className="error-text">

            {error}

          </span>

        )}

        <button onClick={validarLogin}>

          Ingresar al sistema

        </button>

        <div className="demo-users">

          <small>
            admin / 1234
          </small>

          <small>
            cajero / 1234
          </small>

          <small>
            cocina / 1234
          </small>

        </div>

      </section>

    </main>

  );

}

export default Login;