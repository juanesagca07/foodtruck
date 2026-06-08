import { useEffect, useState } from "react";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuariosService";

const rolesFijos = ["Administrador", "Cajero", "Cocina"];

function Usuarios({ setPantalla }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    usuario: "",
    password: "",
    rol: "Cajero",
  });

  const cargarUsuarios = async () => {
    try {
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      usuario: "",
      password: "",
      rol: "Cajero",
    });

    setUsuarioEditando(null);
  };

  const guardarUsuario = async () => {
    if (!formulario.usuario || !formulario.rol) {
      alert("Completa usuario y rol");
      return;
    }

    if (!usuarioEditando && !formulario.password) {
      alert("La contraseña es obligatoria para crear usuario");
      return;
    }

    try {
      const usuarioData = {
        usuario: formulario.usuario.trim(),
        rol: formulario.rol,
      };

      if (formulario.password.trim()) {
        usuarioData.password = formulario.password.trim();
      }

      if (usuarioEditando) {
        await actualizarUsuario(usuarioEditando.id, usuarioData);
        alert("Usuario actualizado correctamente");
      } else {
        await crearUsuario(usuarioData);
        alert("Usuario creado correctamente");
      }

      limpiarFormulario();
      await cargarUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("No se pudo guardar el usuario");
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);

    setFormulario({
      usuario: usuario.usuario || "",
      password: "",
      rol: usuario.rol || "Cajero",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const borrarUsuario = async (id) => {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    try {
      await eliminarUsuario(id);
      await cargarUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("No se pudo eliminar el usuario");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de accesos y roles del sistema</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPantalla("dashboard")}
        >
          Volver
        </button>
      </header>

      <section className="product-admin-layout">
        <aside className="product-form">
          <h2>{usuarioEditando ? "Editar usuario" : "Nuevo usuario"}</h2>

          <input
            type="text"
            name="usuario"
            placeholder="Nombre de usuario"
            value={formulario.usuario}
            onChange={manejarCambio}
          />

          <input
            type="password"
            name="password"
            placeholder={
              usuarioEditando
                ? "Nueva contraseña opcional"
                : "Contraseña"
            }
            value={formulario.password}
            onChange={manejarCambio}
          />

          <select name="rol" value={formulario.rol} onChange={manejarCambio}>
            {rolesFijos.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>

          <button className="primary-btn" onClick={guardarUsuario}>
            {usuarioEditando ? "Guardar cambios" : "Crear usuario"}
          </button>

          {usuarioEditando && (
            <button className="secondary-btn" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </aside>

        <section className="products-admin-list">
          {usuarios.length === 0 ? (
            <p className="empty-text">No hay usuarios registrados</p>
          ) : (
            usuarios.map((item) => (
              <article className="admin-product-card" key={item.id}>
                <div className="admin-product-info">
                  <h2>{item.usuario}</h2>
                  <p>Rol: {item.rol}</p>
                  <small>ID usuario: {item.id}</small>
                </div>

                <div className="order-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => editarUsuario(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() => borrarUsuario(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default Usuarios;