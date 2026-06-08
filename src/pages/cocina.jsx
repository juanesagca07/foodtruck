import { useEffect } from "react";
import toast from "react-hot-toast";

function Cocina({ pedidos, cambiarEstadoPedido, recargarPedidos, setPantalla }) {
  const listaPedidos = pedidos || [];

  const esPedidoAtendido = (pedido) => {
    return pedido.estado === "Entregado" || pedido.estado === "Atendido";
  };

  const pedidosPendientes = listaPedidos.filter(
    (pedido) => !esPedidoAtendido(pedido)
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      recargarPedidos();
    }, 10000);

    return () => clearInterval(intervalo);
  }, [recargarPedidos]);

  const obtenerProductosPedido = (pedido) => {
    return pedido.productosPedido || pedido.productos || [];
  };

  const marcarAtendido = async (pedido) => {
    try {
      await cambiarEstadoPedido(pedido.id, "Entregado");
      toast.success(`Pedido #${pedido.id} atendido`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo marcar el pedido");
    }
  };

  return (
    <main className="kitchen-page">
      <header className="kitchen-header">
        <div>
          <h1>Modo Cocina</h1>
          <p>Pedidos pendientes por preparar</p>
        </div>

        <button className="secondary-btn" onClick={() => setPantalla("dashboard")}>
          Volver
        </button>
      </header>

      {pedidosPendientes.length === 0 ? (
        <section className="kitchen-empty">
          <h2>No hay pedidos pendientes</h2>
          <p>La cocina está al día.</p>
        </section>
      ) : (
        <section className="kitchen-grid">
          {pedidosPendientes.map((pedido) => (
            <article className="kitchen-card" key={pedido.id}>
              <div className="kitchen-card-header">
                <h2>Pedido #{pedido.id}</h2>
                <span>{pedido.metodo_pago}</span>
              </div>

              <p className="kitchen-client">Cliente: {pedido.cliente}</p>

              <div className="kitchen-products">
                {obtenerProductosPedido(pedido).map((producto) => (
                  <div className="kitchen-product" key={producto.id}>
                    <strong>
                      {producto.nombre_producto || producto.nombre} x
                      {producto.cantidad}
                    </strong>

                    {producto.observacion && producto.observacion.trim() !== "" && (
                      <p>Obs: {producto.observacion}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="primary-btn"
                onClick={() => marcarAtendido(pedido)}
              >
                Marcar atendido
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Cocina;