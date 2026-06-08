function Sidebar({
  usuarioActivo,
  pantalla,
  setPantalla,
  cerrarSesion,
  realizarCierreDiario,
}) {
  const rol = usuarioActivo?.rol?.toLowerCase();

  const esAdministrador = rol === "admin" || rol === "administrador";
  const esCajero = rol === "cajero";
  const esCocina = rol === "cocina";

  const itemClass = (pantallaActual) =>
    pantalla === pantallaActual ? "sidebar-link active-sidebar-link" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>FoodTruck</h2>
        <p>{usuarioActivo?.usuario}</p>
        <span>{usuarioActivo?.rol}</span>
      </div>

      <nav className="sidebar-nav">
        <button className={itemClass("dashboard")} onClick={() => setPantalla("dashboard")}>
          🏠 Dashboard
        </button>

        {!esCocina && (
          <button className={itemClass("menu")} onClick={() => setPantalla("menu")}>
            🧾 Tomar pedido
          </button>
        )}

        <button className={itemClass("pedidos")} onClick={() => setPantalla("pedidos")}>
          ⏳ Pedidos
        </button>

        <button className={itemClass("cocina")} onClick={() => setPantalla("cocina")}>
          👨‍🍳 Cocina
        </button>

        {esAdministrador && (
          <>
            <button className={itemClass("ventas")} onClick={() => setPantalla("ventas")}>
              💰 Ventas
            </button>

            <button className={itemClass("productos")} onClick={() => setPantalla("productos")}>
              🍔 Productos
            </button>

            <button className={itemClass("usuarios")} onClick={() => setPantalla("usuarios")}>
              👥 Usuarios
            </button>

            <button className={itemClass("historial")} onClick={() => setPantalla("historial")}>
              📅 Historial
            </button>

            <button className="sidebar-link sidebar-danger" onClick={realizarCierreDiario}>
              🔒 Cerrar día
            </button>
          </>
        )}

        {esCajero && (
          <button className={itemClass("ventas")} onClick={() => setPantalla("ventas")}>
            💰 Ventas
          </button>
        )}
      </nav>

      <button className="sidebar-logout" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;