import logo from "../assets/img/logo.png";

function ProductCard({
  producto,
  agregarProducto
}) {

  return (

    <article
      className={`product-card ${
        !producto.disponible
          ? "disabled"
          : ""
      }`}
    >

      {!producto.disponible && (

        <span className="badge">

          AGOTADO

        </span>

      )}

      <div className="product-image">

        <img
          src={
            producto.imagen || logo
          }
          alt={producto.nombre}
        />

      </div>

      <h3>

        {producto.nombre}

      </h3>

      <p>

        {producto.descripcion}

      </p>

      <strong>

        ${producto.precio.toLocaleString()}

      </strong>

      <button
        className="primary-btn"
        disabled={!producto.disponible}
        onClick={() =>
          agregarProducto(producto)
        }
      >

        Agregar

      </button>

    </article>

  );

}

export default ProductCard;