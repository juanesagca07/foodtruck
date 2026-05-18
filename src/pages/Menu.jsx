import { useState } from "react";

import {
  productos,
  categorias,
} from "../data/productos";

import ProductCard from "../components/ProductCard";
import PedidoItem from "../components/PedidoItem";

function Menu({
  cambiarPantalla,
  pedidoActual,
  agregarProducto,
  quitarProducto,
  confirmarPedido,
  totalPedido,
  pedidoEditando,
}) {

  const [categoriaActiva, setCategoriaActiva] = useState(
    "Hamburguesas"
  );

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.categoria === categoriaActiva
  );

  return (
    <main className="page">

      <header className="topbar">

        <div>

          <h1>
            Menú FoodTruck
          </h1>

          <p>
            {pedidoEditando
              ? `Editando pedido #${pedidoEditando.numero}`
              : "Agrega productos al pedido"}
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            cambiarPantalla("dashboard")
          }
        >
          Volver
        </button>

      </header>

      <section className="menu-layout">

        <div>

          <div className="category-tabs">

            {categorias.map((categoria) => (

              <button
                key={categoria}
                className={
                  categoriaActiva === categoria
                    ? "active-tab"
                    : ""
                }
                onClick={() =>
                  setCategoriaActiva(categoria)
                }
              >
                {categoria}
              </button>

            ))}

          </div>

          <div className="products-grid">

            {productosFiltrados.map((producto) => (

              <ProductCard
                key={producto.id}
                producto={producto}
                agregarProducto={agregarProducto}
              />

            ))}

          </div>

        </div>

        <aside className="order-panel">

          <h2>
            Pedido Actual
          </h2>

          {pedidoActual.length === 0 ? (

            <p className="empty-text">
              No hay productos agregados
            </p>

          ) : (

            pedidoActual.map((item) => (

              <PedidoItem
                key={item.itemId}
                item={item}
                quitarProducto={quitarProducto}
              />

            ))

          )}

          <div className="total-box">

            <span>
              Total
            </span>

            <strong>
              ${totalPedido.toLocaleString()}
            </strong>

          </div>

          <button
            className="primary-btn"
            onClick={confirmarPedido}
          >

            {pedidoEditando
              ? "Guardar cambios"
              : "Confirmar pedido"}

          </button>

        </aside>

      </section>

    </main>
  );

}

export default Menu;