import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { obtenerProductos } from "../services/productosService";

const imagenes = import.meta.glob("../assets/img/*", {
  eager: true,
  import: "default",
});

const categoriasFijas = [
  "Burger",
  "Arepas",
  "Papas",
  "Hot Dogs",
  "Chuzos",
  "Otros",
];

function Menu({
  crearPedido,
  guardarCambiosPedido,
  pedidoEditando,
  limpiarPedidoEditando,
  setPantalla,
}) {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Burger");
  const [pedidoActual, setPedidoActual] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [cliente, setCliente] = useState("Cliente Mostrador");
  const [observaciones, setObservaciones] = useState({});

  const cargarProductos = async () => {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);

      const categoriasDisponibles = categoriasFijas.filter((categoria) =>
        datos.some((producto) => producto.categoria === categoria)
      );

      if (
        categoriasDisponibles.length > 0 &&
        !categoriasDisponibles.includes(categoriaActiva)
      ) {
        setCategoriaActiva(categoriasDisponibles[0]);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast.error("No se pudieron cargar los productos");
      setProductos([]);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (pedidoEditando) {
      setCliente(pedidoEditando.cliente || "Cliente Mostrador");
      setMetodoPago(pedidoEditando.metodo_pago || "Efectivo");

      const productosEditados = (pedidoEditando.productosPedido || []).map(
        (item) => ({
          id: item.producto_id || item.id,
          producto_id: item.producto_id || item.id || null,
          itemId: `${item.id}-${Date.now()}-${Math.random()}`,
          nombre: item.nombre_producto || item.nombre,
          precio: Number(item.precio),
          cantidad: Number(item.cantidad),
          observacion: item.observacion || "",
          disponible: true,
          imagen: "logo.png",
        })
      );

      setPedidoActual(productosEditados);
    }
  }, [pedidoEditando]);

  const categoriasVisibles = categoriasFijas.filter((categoria) =>
    productos.some((producto) => producto.categoria === categoria)
  );

  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaActiva
  );

  const obtenerImagen = (nombreImagen) => {
    if (!nombreImagen) {
      return imagenes["../assets/img/logo.png"];
    }

    return (
      imagenes[`../assets/img/${nombreImagen}`] ||
      imagenes["../assets/img/logo.png"]
    );
  };

  const estaDisponible = (producto) => {
    return (
      producto.disponible === 1 ||
      producto.disponible === true ||
      producto.disponible === "1"
    );
  };

  const cambiarObservacion = (productoId, valor) => {
    setObservaciones({
      ...observaciones,
      [productoId]: valor,
    });
  };

  const agregarProducto = (producto) => {
    if (!estaDisponible(producto)) {
      toast.error("Producto agotado");
      return;
    }

    const observacionProducto = observaciones[producto.id] || "";

    setPedidoActual([
      ...pedidoActual,
      {
        id: producto.id,
        producto_id: producto.id,
        itemId: `${producto.id}-${Date.now()}-${Math.random()}`,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: 1,
        observacion: observacionProducto,
        imagen: producto.imagen || "logo.png",
      },
    ]);

    setObservaciones({
      ...observaciones,
      [producto.id]: "",
    });

    toast.success(`${producto.nombre} agregado`);
  };

  const quitarProducto = (itemId) => {
    setPedidoActual(pedidoActual.filter((item) => item.itemId !== itemId));
    toast.success("Producto eliminado");
  };

  const aumentarCantidad = (itemId) => {
    setPedidoActual(
      pedidoActual.map((item) =>
        item.itemId === itemId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (itemId) => {
    setPedidoActual(
      pedidoActual
        .map((item) =>
          item.itemId === itemId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const cambiarObservacionPedido = (itemId, valor) => {
    setPedidoActual(
      pedidoActual.map((item) =>
        item.itemId === itemId ? { ...item, observacion: valor } : item
      )
    );
  };

  const totalPedido = pedidoActual.reduce(
    (total, item) => total + Number(item.precio) * Number(item.cantidad),
    0
  );

  const limpiarPedido = () => {
    setPedidoActual([]);
    setMetodoPago("Efectivo");
    setCliente("Cliente Mostrador");
    setObservaciones({});
  };

  const cancelarEdicion = () => {
    limpiarPedidoEditando();
    limpiarPedido();
    setPantalla("pedidos");
    toast.success("Edición cancelada");
  };

  const confirmarPedido = async () => {
    if (pedidoActual.length === 0) {
      toast.error("Debes agregar productos");
      return;
    }

    if (!cliente.trim()) {
      toast.error("Debes escribir el nombre del cliente");
      return;
    }

    const pedidoParaMySQL = {
      cliente: cliente.trim(),
      productosPedido: pedidoActual.map((item) => ({
        producto_id: item.producto_id || item.id || null,
        nombre: item.nombre,
        cantidad: Number(item.cantidad),
        precio: Number(item.precio),
        observacion: item.observacion || "",
      })),
      total: Number(totalPedido),
      metodoPago,
    };

    try {
      if (pedidoEditando) {
        await guardarCambiosPedido(pedidoEditando.id, pedidoParaMySQL);
        toast.success("Pedido actualizado");
      } else {
        await crearPedido(pedidoParaMySQL);
        toast.success("Pedido registrado");
      }

      limpiarPedidoEditando();
      limpiarPedido();
      setPantalla("pedidos");
    } catch (error) {
      console.error("Error guardando pedido:", error);
      toast.error("No se pudo guardar el pedido");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>
            {pedidoEditando
              ? `Editando pedido #${pedidoEditando.id}`
              : "Menú FoodTruck"}
          </h1>

          <p>
            {pedidoEditando
              ? "Modifica el pedido pendiente"
              : "Agrega productos al pedido"}
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            pedidoEditando ? cancelarEdicion() : setPantalla("dashboard")
          }
        >
          Volver
        </button>
      </header>

      <section className="menu-layout">
        <div>
          <div className="category-tabs">
            {categoriasVisibles.map((categoria) => (
              <button
                key={categoria}
                className={categoriaActiva === categoria ? "active-tab" : ""}
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {productosFiltrados.map((producto) => {
              const disponible = estaDisponible(producto);

              return (
                <article
                  className={`product-card ${
                    !disponible ? "agotado-card" : ""
                  }`}
                  key={producto.id}
                >
                  {!disponible && (
                    <span className="sold-out-badge">AGOTADO</span>
                  )}

                  <img
                    src={obtenerImagen(producto.imagen)}
                    alt={producto.nombre}
                  />

                  <div className="product-card-content">
                    <h3>{producto.nombre}</h3>

                    <p>{producto.descripcion}</p>

                    <strong>${Number(producto.precio).toLocaleString()}</strong>

                    <input
                      type="text"
                      placeholder="Obs: sin tomate, sin cebolla..."
                      value={observaciones[producto.id] || ""}
                      onChange={(e) =>
                        cambiarObservacion(producto.id, e.target.value)
                      }
                      disabled={!disponible}
                    />

                    <button
                      onClick={() => agregarProducto(producto)}
                      disabled={!disponible}
                    >
                      {disponible ? "Agregar" : "No disponible"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="order-panel">
          <div className="order-panel-header">
            <h2>{pedidoEditando ? "Editando Pedido" : "Pedido Actual"}</h2>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="order-products-list">
            {pedidoActual.length === 0 ? (
              <p className="empty-text">No hay productos agregados</p>
            ) : (
              pedidoActual.map((item) => (
                <div className="pedido-item" key={item.itemId}>
                  <div>
                    <h4>
                      {item.nombre} x{item.cantidad}
                    </h4>

                    <p>${Number(item.precio).toLocaleString()}</p>

                    <input
                      className="pedido-item-observacion"
                      type="text"
                      placeholder="Observación del producto"
                      value={item.observacion || ""}
                      onChange={(e) =>
                        cambiarObservacionPedido(item.itemId, e.target.value)
                      }
                    />
                  </div>

                  <div className="pedido-item-actions">
                    <button onClick={() => disminuirCantidad(item.itemId)}>
                      -
                    </button>

                    <button onClick={() => aumentarCantidad(item.itemId)}>
                      +
                    </button>

                    <button onClick={() => quitarProducto(item.itemId)}>
                      x
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-panel-footer">
            <div className="payment-box">
              <h3>Método de pago</h3>

              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            <div className="total-box">
              <span>Total</span>
              <strong>${totalPedido.toLocaleString()}</strong>
            </div>

            <button className="primary-btn" onClick={confirmarPedido}>
              {pedidoEditando ? "Guardar cambios" : "Confirmar pedido"}
            </button>

            {pedidoEditando && (
              <button
                className="secondary-btn cancel-edit-btn"
                onClick={cancelarEdicion}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Menu;