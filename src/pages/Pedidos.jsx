function Pedidos({
  pedidos,
  cambiarEstadoPedido,
  borrarPedido,
  editarPedido,
  setPantalla,
}) {
  const listaPedidos = pedidos || [];

  const esPedidoAtendido = (pedido) => {
    return pedido.estado === "Entregado" || pedido.estado === "Atendido";
  };

  const obtenerProductosPedido = (pedido) => {
    return pedido.productosPedido || pedido.productos || [];
  };

  const pedidosPendientes = listaPedidos.filter(
    (pedido) => !esPedidoAtendido(pedido)
  );

  const pedidosAtendidos = listaPedidos.filter((pedido) =>
    esPedidoAtendido(pedido)
  );

  const marcarAtendido = async (pedido) => {
    if (esPedidoAtendido(pedido)) {
      alert("Este pedido ya fue atendido");
      return;
    }

    const confirmar = window.confirm(
      `¿Marcar el pedido #${pedido.id} como atendido? Después no se podrá editar ni eliminar.`
    );

    if (!confirmar) return;

    try {
      await cambiarEstadoPedido(pedido.id, "Entregado");
    } catch (error) {
      console.error("Error marcando pedido:", error);
      alert(
        error.response?.data?.error ||
          "No se pudo marcar el pedido como atendido"
      );
    }
  };

  const eliminarPendiente = async (pedido) => {
    if (esPedidoAtendido(pedido)) {
      alert("Los pedidos atendidos no se pueden eliminar");
      return;
    }

    const confirmar = window.confirm(`¿Eliminar el pedido #${pedido.id}?`);
    if (!confirmar) return;

    try {
      await borrarPedido(pedido.id);
    } catch (error) {
      console.error("Error eliminando pedido:", error);
      alert(error.response?.data?.error || "No se pudo eliminar el pedido");
    }
  };

  const editarPendiente = (pedido) => {
    if (esPedidoAtendido(pedido)) {
      alert("Los pedidos atendidos no se pueden editar");
      return;
    }

    editarPedido(pedido);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaPedido = new Date(fecha);

    if (Number.isNaN(fechaPedido.getTime())) {
      return "Sin fecha";
    }

    return fechaPedido.toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const renderProductos = (pedido) => {
    const productosPedido = obtenerProductosPedido(pedido);

    if (!productosPedido || productosPedido.length === 0) {
      return <p>No hay productos asociados</p>;
    }

    return productosPedido.map((producto) => (
      <div className="pedido-producto" key={producto.id}>
        <p>
          <strong>{producto.nombre_producto || producto.nombre}</strong> x
          {producto.cantidad} - ${Number(producto.precio).toLocaleString()}
        </p>

        {producto.observacion && producto.observacion.trim() !== "" && (
          <small className="observacion-text">
            Observación: {producto.observacion}
          </small>
        )}
      </div>
    ));
  };

  const renderPedido = (pedido) => {
    const atendido = esPedidoAtendido(pedido);

    return (
      <article
        className={`order-card ${
          atendido ? "pedido-atendido" : "pedido-pendiente"
        }`}
        key={pedido.id}
      >
        <h2>Pedido #{pedido.id}</h2>

        <p>Cliente: {pedido.cliente}</p>
        <p>Método de pago: {pedido.metodo_pago}</p>
        <p>Fecha: {formatearFecha(pedido.fecha)}</p>

        <p>
          Estado: <strong>{atendido ? "Atendido" : "Pendiente"}</strong>
        </p>

        <p>
          Total: <strong>${Number(pedido.total).toLocaleString()}</strong>
        </p>

        <h3>Productos</h3>

        {renderProductos(pedido)}

        {atendido ? (
          <p className="locked-text">
            Pedido atendido. No se puede editar ni eliminar.
          </p>
        ) : (
          <div className="order-actions">
            <button
              className="primary-btn"
              onClick={() => marcarAtendido(pedido)}
            >
              Marcar atendido
            </button>

            <button
              className="secondary-btn"
              onClick={() => editarPendiente(pedido)}
            >
              Editar
            </button>

            <button
              className="danger-btn"
              onClick={() => eliminarPendiente(pedido)}
            >
              Eliminar
            </button>
          </div>
        )}
      </article>
    );
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Pedidos</h1>
          <p>Gestión de pedidos pendientes y atendidos</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPantalla("dashboard")}
        >
          Volver
        </button>
      </header>

      <section className="pedidos-layout-final">
        <section>
          <h2 className="section-title">
            Pendientes ({pedidosPendientes.length})
          </h2>

          {pedidosPendientes.length === 0 ? (
            <p className="empty-text">No hay pedidos pendientes</p>
          ) : (
            <div className="orders-list">
              {pedidosPendientes.map((pedido) => renderPedido(pedido))}
            </div>
          )}
        </section>

        <section>
          <h2 className="section-title">
            Atendidos ({pedidosAtendidos.length})
          </h2>

          {pedidosAtendidos.length === 0 ? (
            <p className="empty-text">No hay pedidos atendidos</p>
          ) : (
            <div className="orders-list">
              {pedidosAtendidos.map((pedido) => renderPedido(pedido))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Pedidos;