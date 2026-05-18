import DashboardCard from "../components/DashboardCard";

function Dashboard({
  usuarioActivo,
  cambiarPantalla,
  cerrarSesion,
  pedidosPendientes,
  pedidosAtendidos,
}) {

  return (

    <main className="page">

      <header className="topbar">

        <div>

          <h1>

            FoodTruck Dashboard

          </h1>

          <p>

            Bienvenido:
            {" "}
            {usuarioActivo.usuario}

          </p>

          <span>

            Rol:
            {" "}
            {usuarioActivo.rol}

          </span>

        </div>

        <button
          className="secondary-btn"
          onClick={cerrarSesion}
        >

          Cerrar sesión

        </button>

      </header>

      <section className="dashboard-grid">

        <DashboardCard
          title="Tomar Pedido"
          description="Abrir menú y registrar productos"
          value="Menú"
          onClick={() =>
            cambiarPantalla("menu")
          }
        />

        <DashboardCard
          title="Pedidos"
          description="Pedidos pendientes y atendidos"
          value={pedidosPendientes.length}
          onClick={() =>
            cambiarPantalla("pedidos")
          }
        />

        <DashboardCard
          title="Ventas"
          description="Resumen de ventas"
          value={pedidosAtendidos.length}
          onClick={() =>
            cambiarPantalla("ventas")
          }
        />

      </section>

    </main>

  );

}

export default Dashboard;