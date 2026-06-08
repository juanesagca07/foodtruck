import DashboardCard from "../components/DashboardCard";

function Dashboard({
  usuarioActivo,
  pedidos,
  setPantalla,
  cerrarSesion,
  realizarCierreDiario,
}) {
  const listaPedidos = pedidos || [];

  const esPedidoAtendido = (pedido) => {
    return pedido.estado === "Entregado" || pedido.estado === "Atendido";
  };

  const pedidosPendientes = listaPedidos.filter(
    (pedido) => !esPedidoAtendido(pedido)
  );

  const pedidosEntregados = listaPedidos.filter((pedido) =>
    esPedidoAtendido(pedido)
  );

  const totalVentas = pedidosEntregados.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  const totalPedidos = listaPedidos.length;

  const rol = usuarioActivo?.rol?.toLowerCase();

  const esAdministrador = rol === "admin" || rol === "administrador";
  const esCajero = rol === "cajero";
  const esCocina = rol === "cocina";

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>FoodTruck Dashboard</h1>

          <p>
            Bienvenido: <strong>{usuarioActivo?.usuario}</strong>
          </p>

          <span>
            Rol: <strong>{usuarioActivo?.rol}</strong>
          </span>
        </div>

        <button className="secondary-btn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <section className="dashboard-grid">
        {esAdministrador && (
          <>
            <DashboardCard
              icon="🧾"
              title="Tomar Pedido"
              description="Abrir menú y registrar pedidos"
              value="Menú"
              variant="card-yellow"
              onClick={() => setPantalla("menu")}
            />

            <DashboardCard
              icon="👨‍🍳"
              title="Modo Cocina"
              description="Pantalla de preparación de pedidos"
              value={pedidosPendientes.length}
              variant="card-kitchen"
              onClick={() => setPantalla("cocina")}
            />

            <DashboardCard
              icon="⏳"
              title="Pedidos Pendientes"
              description="Pedidos activos por preparar"
              value={pedidosPendientes.length}
              variant="card-warning"
              onClick={() => setPantalla("pedidos")}
            />

            <DashboardCard
              icon="💰"
              title="Ventas"
              description="Total vendido en pedidos atendidos"
              value={`$${totalVentas.toLocaleString()}`}
              variant="card-success"
              onClick={() => setPantalla("ventas")}
            />

            <DashboardCard
              icon="🍔"
              title="Productos"
              description="Administrar productos y disponibilidad"
              value="CRUD"
              variant="card-products"
              onClick={() => setPantalla("productos")}
            />

            <DashboardCard
              icon="👥"
              title="Usuarios"
              description="Gestionar usuarios y roles"
              value="Roles"
              variant="card-users"
              onClick={() => setPantalla("usuarios")}
            />

            <DashboardCard
              icon="📦"
              title="Pedidos Totales"
              description="Todos los pedidos activos"
              value={totalPedidos}
              variant="card-info"
              onClick={() => setPantalla("pedidos")}
            />

            <DashboardCard
              icon="🔒"
              title="Cerrar Día"
              description="Reiniciar operación diaria sin borrar historial"
              value="Cierre"
              variant="card-danger"
              onClick={realizarCierreDiario}
            />

            <DashboardCard
              icon="📅"
              title="Historial"
              description="Consultar cierres diarios por fecha"
              value="Fechas"
              variant="card-history"
              onClick={() => setPantalla("historial")}
            />
          </>
        )}

        {esCajero && (
          <>
            <DashboardCard
              icon="🧾"
              title="Tomar Pedido"
              description="Registrar pedidos de clientes"
              value="Menú"
              variant="card-yellow"
              onClick={() => setPantalla("menu")}
            />

            <DashboardCard
              icon="⏳"
              title="Pedidos"
              description="Ver pedidos pendientes"
              value={pedidosPendientes.length}
              variant="card-warning"
              onClick={() => setPantalla("pedidos")}
            />

            <DashboardCard
              icon="💰"
              title="Ventas"
              description="Consultar ventas realizadas"
              value={`$${totalVentas.toLocaleString()}`}
              variant="card-success"
              onClick={() => setPantalla("ventas")}
            />
          </>
        )}

        {esCocina && (
          <>
            <DashboardCard
              icon="👨‍🍳"
              title="Modo Cocina"
              description="Pantalla de preparación"
              value={pedidosPendientes.length}
              variant="card-kitchen"
              onClick={() => setPantalla("cocina")}
            />

            <DashboardCard
              icon="⏳"
              title="Pedidos Pendientes"
              description="Pedidos por preparar"
              value={pedidosPendientes.length}
              variant="card-warning"
              onClick={() => setPantalla("pedidos")}
            />
          </>
        )}
      </section>
    </main>
  );
}

export default Dashboard;