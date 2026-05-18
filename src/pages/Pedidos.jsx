function Pedidos({
  cambiarPantalla,
  pedidosPendientes,
  pedidosAtendidos,
  marcarAtendido,
}) {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Control de Pedidos</h1>
          <p>Gestión de pedidos pendientes y atendidos.</p>
        </div>

        <button className="secondary-btn" onClick={() => cambiarPantalla("dashboard")}>
          Volver
        </button>
      </header>

      <section className="orders-layout">
        <div>
          <h2 className="section-title">Pendientes</h2>

          {pedidosPendientes.length === 0 ? (
            <p className="empty-text">No hay pedidos pendientes.</p>
          ) : (
            pedidosPendientes.map((pedido) => (
              <article className="order-card" key={pedido.id}>
                <h3>Pedido #{pedido.numero}</h3>
                <p>{pedido.fecha}</p>

                {pedido.productos.map((item) => (
                  <div className="order-line" key={item.itemId}>
                    <span>{item.nombre}</span>
                    <strong>${item.precio.toLocaleString()}</strong>
                    {item.observacion && <small>Obs: {item.observacion}</small>}
                  </div>
                ))}

                <div className="total-box">
                  <span>Total</span>
                  <strong>${pedido.total.toLocaleString()}</strong>
                </div>

                <button className="primary-btn" onClick={() => marcarAtendido(pedido.id)}>
                  Marcar como atendido
                </button>
              </article>
            ))
          )}
        </div>

        <div>
          <h2 className="section-title">Atendidos</h2>

          {pedidosAtendidos.length === 0 ? (
            <p className="empty-text">No hay pedidos atendidos.</p>
          ) : (
            pedidosAtendidos.map((pedido) => (
              <article className="order-card attended" key={pedido.id}>
                <h3>Pedido #{pedido.numero}</h3>
                <p>{pedido.fechaAtendido}</p>
                <strong>${pedido.total.toLocaleString()}</strong>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Pedidos;