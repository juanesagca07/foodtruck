import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

function Ventas({ pedidos, setPantalla }) {
  const listaPedidos = pedidos || [];

  const esPedidoAtendido = (pedido) => {
    return pedido.estado === "Entregado" || pedido.estado === "Atendido";
  };

  const obtenerProductosPedido = (pedido) => {
    return pedido.productosPedido || pedido.productos || [];
  };

  const pedidosAtendidos = listaPedidos.filter((pedido) =>
    esPedidoAtendido(pedido)
  );

  const totalVentas = pedidosAtendidos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  const ventasEfectivo = pedidosAtendidos
    .filter((pedido) => pedido.metodo_pago === "Efectivo")
    .reduce((total, pedido) => total + Number(pedido.total || 0), 0);

  const ventasTransferencia = pedidosAtendidos
    .filter((pedido) => pedido.metodo_pago === "Transferencia")
    .reduce((total, pedido) => total + Number(pedido.total || 0), 0);

  const ticketPromedio =
    pedidosAtendidos.length > 0 ? totalVentas / pedidosAtendidos.length : 0;

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

  const generarPDF = () => {
    if (pedidosAtendidos.length === 0) {
      toast.error("No hay ventas para exportar");
      return;
    }

    const doc = new jsPDF();

    const fechaReporte = new Date().toLocaleString("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Reporte de Ventas - FoodTruck", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generado: ${fechaReporte}`, 14, 26);

    doc.setFontSize(12);
    doc.text(`Pedidos atendidos: ${pedidosAtendidos.length}`, 14, 40);
    doc.text(`Total vendido: $${totalVentas.toLocaleString()}`, 14, 48);
    doc.text(`Ventas en efectivo: $${ventasEfectivo.toLocaleString()}`, 14, 56);
    doc.text(
      `Ventas por transferencia: $${ventasTransferencia.toLocaleString()}`,
      14,
      64
    );
    doc.text(
      `Ticket promedio: $${Math.round(ticketPromedio).toLocaleString()}`,
      14,
      72
    );

    const filas = pedidosAtendidos.map((pedido) => {
      const productosTexto = obtenerProductosPedido(pedido)
        .map((producto) => {
          const nombre = producto.nombre_producto || producto.nombre;
          const observacion = producto.observacion
            ? ` (${producto.observacion})`
            : "";

          return `${nombre} x${producto.cantidad}${observacion}`;
        })
        .join(", ");

      return [
        pedido.id,
        pedido.cliente,
        pedido.metodo_pago,
        formatearFecha(pedido.fecha),
        productosTexto || "Sin productos",
        `$${Number(pedido.total || 0).toLocaleString()}`,
      ];
    });

    autoTable(doc, {
      startY: 84,
      head: [["ID", "Cliente", "Pago", "Fecha", "Productos", "Total"]],
      body: filas,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [242, 183, 5],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 14 },
        1: { cellWidth: 28 },
        2: { cellWidth: 26 },
        3: { cellWidth: 30 },
        4: { cellWidth: 65 },
        5: { cellWidth: 25 },
      },
    });

    doc.save(`reporte-ventas-foodtruck-${Date.now()}.pdf`);
    toast.success("PDF generado correctamente");
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Ventas</h1>
          <p>Resumen de pedidos atendidos y ventas registradas</p>
        </div>

        <div className="topbar-actions">
          <button className="primary-btn" onClick={generarPDF}>
            Exportar PDF
          </button>

          <button
            className="secondary-btn"
            onClick={() => setPantalla("dashboard")}
          >
            Volver
          </button>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <h2>Pedidos atendidos</h2>
            <strong>{pedidosAtendidos.length}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <h2>Total vendido</h2>
            <strong>${totalVentas.toLocaleString()}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <h2>Efectivo</h2>
            <strong>${ventasEfectivo.toLocaleString()}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <h2>Transferencia</h2>
            <strong>${ventasTransferencia.toLocaleString()}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <h2>Ticket promedio</h2>
            <strong>${Math.round(ticketPromedio).toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <section className="orders-list">
        {pedidosAtendidos.length === 0 ? (
          <p className="empty-text">Todavía no hay ventas registradas</p>
        ) : (
          pedidosAtendidos.map((pedido) => {
            const productosPedido = obtenerProductosPedido(pedido);

            return (
              <article className="order-card pedido-atendido" key={pedido.id}>
                <h2>Venta #{pedido.id}</h2>

                <p>Cliente: {pedido.cliente}</p>
                <p>Método de pago: {pedido.metodo_pago}</p>
                <p>Fecha: {formatearFecha(pedido.fecha)}</p>
                <p>Estado: Atendido</p>

                <h3>Productos vendidos</h3>

                {productosPedido.length > 0 ? (
                  productosPedido.map((producto) => (
                    <div className="pedido-producto" key={producto.id}>
                      <p>
                        <strong>
                          {producto.nombre_producto || producto.nombre}
                        </strong>{" "}
                        x{producto.cantidad} - $
                        {Number(producto.precio).toLocaleString()}
                      </p>

                      {producto.observacion &&
                        producto.observacion.trim() !== "" && (
                          <small className="observacion-text">
                            Observación: {producto.observacion}
                          </small>
                        )}
                    </div>
                  ))
                ) : (
                  <p>No hay productos asociados</p>
                )}

                <strong>
                  Total: ${Number(pedido.total || 0).toLocaleString()}
                </strong>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default Ventas;