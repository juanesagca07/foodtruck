import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Ventas from "./pages/Ventas";

import { guardarPedido } from "./services/pedidosService";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [pantalla, setPantalla] = useState("login");
  const [pedidoActual, setPedidoActual] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const [pedidosPendientes, setPedidosPendientes] = useState(() => {
    return JSON.parse(localStorage.getItem("pedidosPendientes")) || [];
  });

  const [pedidosAtendidos, setPedidosAtendidos] = useState(() => {
    return JSON.parse(localStorage.getItem("pedidosAtendidos")) || [];
  });

  useEffect(() => {
    localStorage.setItem("pedidosPendientes", JSON.stringify(pedidosPendientes));
    localStorage.setItem("pedidosAtendidos", JSON.stringify(pedidosAtendidos));
  }, [pedidosPendientes, pedidosAtendidos]);

  const iniciarSesion = (usuario) => {
    setUsuarioActivo(usuario);
    setPantalla("dashboard");
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
    setPedidoActual([]);
    setPedidoEditando(null);
    setMetodoPago("Efectivo");
    setPantalla("login");
  };

  const agregarProducto = (producto, observacion = "") => {
    const obs = observacion.trim();

    const itemExistente = pedidoActual.find(
      (item) => item.id === producto.id && item.observacion === obs
    );

    if (itemExistente) {
      setPedidoActual(
        pedidoActual.map((item) =>
          item.id === producto.id && item.observacion === obs
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
      return;
    }

    const nuevoItem = {
      ...producto,
      itemId: Date.now(),
      cantidad: 1,
      observacion: obs,
    };

    setPedidoActual([...pedidoActual, nuevoItem]);
  };

  const quitarProducto = (itemId) => {
    const actualizado = pedidoActual
      .map((item) =>
        item.itemId === itemId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter((item) => item.cantidad > 0);

    setPedidoActual(actualizado);
  };

  const totalPedido = pedidoActual.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const confirmarPedido = async () => {
    if (pedidoActual.length === 0) {
      alert("Agrega productos primero");
      return;
    }

    if (pedidoEditando) {
      const pedidosActualizados = pedidosPendientes.map((pedido) =>
        pedido.id === pedidoEditando.id
          ? {
              ...pedido,
              productos: pedidoActual,
              total: totalPedido,
              metodoPago,
              fecha: new Date().toLocaleString(),
            }
          : pedido
      );

      setPedidosPendientes(pedidosActualizados);
      setPedidoActual([]);
      setPedidoEditando(null);
      setMetodoPago("Efectivo");
      setPantalla("pedidos");
      return;
    }

    const nuevoPedido = {
      id: Date.now(),
      numero: pedidosPendientes.length + pedidosAtendidos.length + 1,
      productos: pedidoActual,
      total: totalPedido,
      metodoPago,
      estado: "Pendiente",
      fecha: new Date().toLocaleString(),
    };

    setPedidosPendientes([...pedidosPendientes, nuevoPedido]);

    await guardarPedido(nuevoPedido);

    setPedidoActual([]);
    setMetodoPago("Efectivo");
    setPantalla("pedidos");
  };

  const editarPedido = (pedido) => {
    setPedidoEditando(pedido);
    setPedidoActual(pedido.productos);
    setMetodoPago(pedido.metodoPago || "Efectivo");
    setPantalla("menu");
  };

  const marcarAtendido = (idPedido) => {
    const pedido = pedidosPendientes.find((pedido) => pedido.id === idPedido);

    if (!pedido) return;

    const pedidoAtendido = {
      ...pedido,
      estado: "Atendido",
      fechaAtendido: new Date().toLocaleString(),
    };

    setPedidosPendientes(
      pedidosPendientes.filter((pedido) => pedido.id !== idPedido)
    );

    setPedidosAtendidos([...pedidosAtendidos, pedidoAtendido]);
  };

  if (pantalla === "login") {
    return <Login iniciarSesion={iniciarSesion} />;
  }

  if (pantalla === "dashboard") {
    return (
      <Dashboard
        usuarioActivo={usuarioActivo}
        cambiarPantalla={setPantalla}
        cerrarSesion={cerrarSesion}
        pedidosPendientes={pedidosPendientes}
        pedidosAtendidos={pedidosAtendidos}
      />
    );
  }

  if (pantalla === "menu") {
    return (
      <Menu
        cambiarPantalla={setPantalla}
        pedidoActual={pedidoActual}
        agregarProducto={agregarProducto}
        quitarProducto={quitarProducto}
        confirmarPedido={confirmarPedido}
        totalPedido={totalPedido}
        pedidoEditando={pedidoEditando}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
      />
    );
  }

  if (pantalla === "pedidos") {
    return (
      <Pedidos
        cambiarPantalla={setPantalla}
        pedidosPendientes={pedidosPendientes}
        pedidosAtendidos={pedidosAtendidos}
        marcarAtendido={marcarAtendido}
        editarPedido={editarPedido}
      />
    );
  }

  if (pantalla === "ventas") {
    return (
      <Ventas
        cambiarPantalla={setPantalla}
        pedidosAtendidos={pedidosAtendidos}
      />
    );
  }

  return <Login iniciarSesion={iniciarSesion} />;
}

export default App;