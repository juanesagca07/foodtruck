import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Ventas from "./pages/Ventas";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [pantalla, setPantalla] = useState("login");
  const [pedidoActual, setPedidoActual] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosAtendidos, setPedidosAtendidos] = useState([]);

  const iniciarSesion = (usuario) => {
    setUsuarioActivo(usuario);
    setPantalla("dashboard");
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
    setPedidoActual([]);
    setPantalla("login");
  };

  const agregarProducto = (producto, observacion) => {
    const nuevoItem = {
      ...producto,
      itemId: Date.now(),
      observacion,
    };

    setPedidoActual([...pedidoActual, nuevoItem]);
  };

  const quitarProducto = (itemId) => {
    setPedidoActual(pedidoActual.filter((item) => item.itemId !== itemId));
  };

  const totalPedido = pedidoActual.reduce((total, item) => total + item.precio, 0);

  const confirmarPedido = () => {
    if (pedidoActual.length === 0) {
      alert("Agrega productos antes de confirmar el pedido.");
      return;
    }

    const nuevoPedido = {
      id: Date.now(),
      numero: pedidosPendientes.length + pedidosAtendidos.length + 1,
      productos: pedidoActual,
      total: totalPedido,
      estado: "Pendiente",
      fecha: new Date().toLocaleString(),
    };

    setPedidosPendientes([...pedidosPendientes, nuevoPedido]);
    setPedidoActual([]);
    setPantalla("pedidos");
  };

  const marcarAtendido = (idPedido) => {
    const pedido = pedidosPendientes.find((pedido) => pedido.id === idPedido);

    if (!pedido) return;

    const pedidoAtendido = {
      ...pedido,
      estado: "Atendido",
      fechaAtendido: new Date().toLocaleString(),
    };

    setPedidosPendientes(pedidosPendientes.filter((pedido) => pedido.id !== idPedido));
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