function PedidoItem({ item, quitarProducto }) {
  return (
    <div className="pedido-item">
      <div>
        <strong>
          {item.nombre} x{item.cantidad}
        </strong>

        <p>${(item.precio * item.cantidad).toLocaleString()}</p>

        {item.observacion && <small>Obs: {item.observacion}</small>}
      </div>

      <button onClick={() => quitarProducto(item.itemId)}>
        -
      </button>
    </div>
  );
}

export default PedidoItem;