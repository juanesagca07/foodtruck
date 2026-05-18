function PedidoItem({ item, quitarProducto }) {
  return (
    <div className="pedido-item">
      <div>
        <strong>{item.nombre}</strong>
        <p>${item.precio.toLocaleString()}</p>

        {item.observacion && (
          <small>Obs: {item.observacion}</small>
        )}
      </div>

      <button onClick={() => quitarProducto(item.itemId)}>
        X
      </button>
    </div>
  );
}

export default PedidoItem;