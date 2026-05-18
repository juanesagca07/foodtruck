import { useState } from "react";
import logo from "../assets/img/logo.png";

function ProductCard({ producto, agregarProducto }) {
  const [observacion, setObservacion] = useState("");

  const agregarAlPedido = () => {
    agregarProducto(producto, observacion);
    setObservacion("");
  };

  return (
    <article className={`product-card ${!producto.disponible ? "disabled" : ""}`}>
      {!producto.disponible && <span className="badge">AGOTADO</span>}

      <div className="product-image">
        <img src={producto.imagen || logo} alt={producto.nombre} />
      </div>

      <h3>{producto.nombre}</h3>

      <p>{producto.descripcion}</p>

      <strong>${producto.precio.toLocaleString()}</strong>

      <input
        type="text"
        placeholder="Obs: sin tomate, sin cebolla..."
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        disabled={!producto.disponible}
      />

      <button
        className="primary-btn"
        disabled={!producto.disponible}
        onClick={agregarAlPedido}
      >
        Agregar
      </button>
    </article>
  );
}

export default ProductCard;