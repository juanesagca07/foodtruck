import { useState } from "react";
import toast from "react-hot-toast";

import {
  obtenerHistorialPorFecha,
} from "../services/pedidosService";

function Historial({ setPantalla }) {

  const [fecha, setFecha] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const buscarHistorial = async () => {

    if (!fecha) {
      toast.error("Selecciona una fecha");
      return;
    }

    try {

      setCargando(true);

      const datos = await obtenerHistorialPorFecha(fecha);

      setPedidos(datos);

      if (datos.length === 0) {
        toast("No hay cierres para esa fecha");
      }

    } catch (error) {

      console.error(error);

      toast.error("No se pudo cargar el historial");

    } finally {

      setCargando(false);
    }
  };

  const totalVentas = pedidos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  return (
    <main className="page">

      <header className="topbar">

        <div>
          <h1>Historial Diario</h1>

          <p>
            Consulta cierres diarios por fecha
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPantalla("dashboard")}
        >
          Volver
        </button>

      </header>

      <section className="history-toolbar">

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={buscarHistorial}
          disabled={cargando}
        >
          {cargando ? "Buscando..." : "Buscar"}
        </button>

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h2>Pedidos encontrados</h2>

            <strong>
              {pedidos.length}
            </strong>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h2>Total vendido</h2>

            <strong>
              ${totalVentas.toLocaleString()}
            </strong>

          </div>

        </div>

      </section>

      <section className="orders-list">

        {pedidos.length === 0 ? (

          <p className="empty-text">
            No hay historial cargado
          </p>

        ) : (

          pedidos.map((pedido) => (

            <article
              className="order-card pedido-atendido"
              key={pedido.id}
            >

              <h2>
                Pedido #{pedido.id}
              </h2>

              <p>
                Cliente: {pedido.cliente}
              </p>

              <p>
                Método de pago: {pedido.metodo_pago}
              </p>

              <p>
                Total: $
                {Number(
                  pedido.total || 0
                ).toLocaleString()}
              </p>

              <p>
                Fecha cierre:{" "}
                {new Date(
                  pedido.fecha_cierre
                ).toLocaleString("es-CO")}
              </p>

              <h3>Productos</h3>

              {(pedido.productosPedido || []).map(
                (producto) => (

                  <div
                    key={producto.id}
                    className="pedido-producto"
                  >

                    <p>

                      <strong>
                        {producto.nombre_producto}
                      </strong>{" "}

                      x{producto.cantidad}

                    </p>

                    {producto.observacion && (

                      <small className="observacion-text">

                        Obs: {producto.observacion}

                      </small>

                    )}

                  </div>
                )
              )}

            </article>
          ))
        )}

      </section>

    </main>
  );
}

export default Historial;