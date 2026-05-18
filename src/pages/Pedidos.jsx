function Pedidos({
  cambiarPantalla,
  pedidosPendientes,
  pedidosAtendidos,
  marcarAtendido,
  editarPedido,
}) {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Control de Pedidos</h1>
          <p>Gestión de pedidos del sistema</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => cambiarPantalla("dashboard")}
        >
          Volver
        </button>
      </header>

      <section className="orders-layout">
        <div>
          <h2 className="section-title">Pendientes</h2>

          {pedidosPendientes.length === 0 ? (
            <p className="empty-text">No hay pedidos pendientes</p>
          ) : (
            pedidosPendientes.map((pedido) => (
              <article className="ticket-card" key={pedido.id}>
                <div className="ticket-header">
                  <h3>Pedido #{pedido.numero}</h3>
                  <span>{pedido.fecha}</span>
                </div>

                <div className="ticket-body">
                  {pedido.productos.map((item) => (
                    <div className="ticket-line" key={item.itemId}>
                      <div>
                        <strong>
                          {item.nombre} x{item.cantidad}
                        </strong>

                        {item.observacion && (
                          <small>Obs: {item.observacion}</small>
                        )}
                      </div>

                      <span>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="payment-ticket">
                  Pago: <strong>{pedido.metodoPago || "Efectivo"}</strong>
                </div>

                <div className="ticket-total">
                  <strong>TOTAL</strong>
                  <strong>${pedido.total.toLocaleString()}</strong>
                </div>

                <div className="ticket-actions">
                  <button
                    className="primary-btn"
                    onClick={() => editarPedido(pedido)}
                  >
                    Editar pedido
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => marcarAtendido(pedido.id)}
                  >
                    Marcar atendido
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div>
          <h2 className="section-title">Atendidos</h2>

          {pedidosAtendidos.length === 0 ? (
            <p className="empty-text">No hay pedidos atendidos</p>
          ) : (
            pedidosAtendidos.map((pedido) => (
              <article className="ticket-card attended" key={pedido.id}>
                <div className="ticket-header">
                  <h3>Pedido #{pedido.numero}</h3>
                  <span>{pedido.fechaAtendido}</span>
                </div>

                <div className="payment-ticket">
                  Pago: <strong>{pedido.metodoPago || "Efectivo"}</strong>
                </div>

                <div className="ticket-total">
                  <strong>TOTAL</strong>
                  <strong>${pedido.total.toLocaleString()}</strong>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Pedidos;