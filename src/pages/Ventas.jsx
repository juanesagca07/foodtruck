function Ventas({ cambiarPantalla, pedidosAtendidos }) {
  const totalVentas = pedidosAtendidos.reduce(
    (total, pedido) => total + pedido.total,
    0
  );

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Ventas del Día</h1>
          <p>Resumen comercial de pedidos atendidos.</p>
        </div>

        <button className="secondary-btn" onClick={() => cambiarPantalla("dashboard")}>
          Volver
        </button>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total vendido</h2>
          <strong>${totalVentas.toLocaleString()}</strong>
        </div>

        <div className="dashboard-card">
          <h2>Pedidos atendidos</h2>
          <strong>{pedidosAtendidos.length}</strong>
        </div>
      </section>

      <section className="history-box">
        <h2>Historial</h2>

        {pedidosAtendidos.length === 0 ? (
          <p className="empty-text">Aún no hay ventas registradas.</p>
        ) : (
          pedidosAtendidos.map((pedido) => (
            <div className="history-item" key={pedido.id}>
              <span>Pedido #{pedido.numero}</span>
              <strong>${pedido.total.toLocaleString()}</strong>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default Ventas;