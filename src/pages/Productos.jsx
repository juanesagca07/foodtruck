import { useEffect, useState } from "react";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  cambiarDisponibilidadProducto,
  eliminarProducto,
} from "../services/productosService";

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

function Productos({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Burger",
    imagen: "",
    disponible: true,
  });

  const obtenerImagen = (nombreImagen) => {
    if (!nombreImagen) {
      return imagenes["../assets/img/logo.png"];
    }

    return (
      imagenes[`../assets/img/${nombreImagen}`] ||
      imagenes["../assets/img/logo.png"]
    );
  };

  const cargarProductos = async () => {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "Burger",
      imagen: "",
      disponible: true,
    });

    setProductoEditando(null);
  };

  const guardarProducto = async () => {
    if (
      !formulario.nombre ||
      !formulario.descripcion ||
      !formulario.precio ||
      !formulario.categoria
    ) {
      alert("Completa nombre, descripción, precio y categoría");
      return;
    }

    if (Number(formulario.precio) <= 0) {
      alert("El precio debe ser mayor a cero");
      return;
    }

    try {
      const productoData = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        precio: Number(formulario.precio),
        categoria: formulario.categoria,
        imagen: formulario.imagen.trim() || "logo.png",
        disponible: formulario.disponible,
      };

      if (productoEditando) {
        await actualizarProducto(productoEditando.id, productoData);
        alert("Producto actualizado correctamente");
      } else {
        await crearProducto(productoData);
        alert("Producto creado correctamente");
      }

      limpiarFormulario();
      await cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto");
    }
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto);

    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      categoria: producto.categoria || "Burger",
      imagen: producto.imagen || "",
      disponible:
        producto.disponible === 1 ||
        producto.disponible === true ||
        producto.disponible === "1",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cambiarDisponibilidad = async (producto) => {
    try {
      const disponibleActual =
        producto.disponible === 1 ||
        producto.disponible === true ||
        producto.disponible === "1";

      await cambiarDisponibilidadProducto(producto.id, !disponibleActual);
      await cargarProductos();
    } catch (error) {
      console.error("Error cambiando disponibilidad:", error);
      alert("No se pudo cambiar la disponibilidad");
    }
  };

  const borrarProducto = async (id) => {
    const confirmar = window.confirm("¿Eliminar este producto?");
    if (!confirmar) return;

    try {
      await eliminarProducto(id);
      await cargarProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Productos</h1>
          <p>Administración del menú FoodTruck</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPantalla("dashboard")}
        >
          Volver
        </button>
      </header>

      <section className="product-admin-layout">
        <aside className="product-form">
          <h2>{productoEditando ? "Editar producto" : "Nuevo producto"}</h2>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={formulario.nombre}
            onChange={manejarCambio}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción del producto"
            value={formulario.descripcion}
            onChange={manejarCambio}
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formulario.precio}
            onChange={manejarCambio}
          />

          <select
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
          >
            {categoriasFijas.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="imagen"
            placeholder="Ej: pajaro-loco.png"
            value={formulario.imagen}
            onChange={manejarCambio}
          />

          <small className="form-help">
            Guarda la imagen en src/assets/img/ y escribe aquí el nombre exacto.
            Si lo dejas vacío, se usará logo.png.
          </small>

          <img
            className="product-preview-img"
            src={obtenerImagen(formulario.imagen)}
            alt="Vista previa"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="disponible"
              checked={formulario.disponible}
              onChange={manejarCambio}
            />
            Producto disponible
          </label>

          <button className="primary-btn" onClick={guardarProducto}>
            {productoEditando ? "Guardar cambios" : "Crear producto"}
          </button>

          {productoEditando && (
            <button className="secondary-btn" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </aside>

        <section className="products-admin-list">
          {productos.length === 0 ? (
            <p className="empty-text">No hay productos registrados</p>
          ) : (
            productos.map((producto) => {
              const disponible =
                producto.disponible === 1 ||
                producto.disponible === true ||
                producto.disponible === "1";

              return (
                <article
                  key={producto.id}
                  className={`admin-product-card ${
                    !disponible ? "agotado-card" : ""
                  }`}
                >
                  <img
                    className="admin-product-img"
                    src={obtenerImagen(producto.imagen)}
                    alt={producto.nombre}
                  />

                  <div className="admin-product-info">
                    <h2>{producto.nombre}</h2>

                    <p>{producto.descripcion}</p>

                    <strong>
                      ${Number(producto.precio).toLocaleString()}
                    </strong>

                    <span>Categoría: {producto.categoria}</span>

                    <p>
                      Estado:{" "}
                      <strong>{disponible ? "Disponible" : "Agotado"}</strong>
                    </p>

                    <small>Imagen: {producto.imagen || "logo.png"}</small>
                  </div>

                  <div className="order-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => editarProducto(producto)}
                    >
                      Editar
                    </button>

                    <button
                      className="primary-btn"
                      onClick={() => cambiarDisponibilidad(producto)}
                    >
                      {disponible ? "Marcar agotado" : "Marcar disponible"}
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => borrarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </section>
    </main>
  );
}

export default Productos;