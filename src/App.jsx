import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Ventas from "./pages/Ventas";

import {

  guardarPedido,

  obtenerPedidos,

  actualizarPedido

} from "./services/pedidosService";

function App() {

  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const [pantalla, setPantalla] = useState("login");

  const [pedidoActual, setPedidoActual] = useState([]);

  const [pedidoEditando, setPedidoEditando] = useState(null);

  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const [pedidosPendientes, setPedidosPendientes] = useState([]);

  const [pedidosAtendidos, setPedidosAtendidos] = useState([]);

  useEffect(() => {

    cargarPedidos();

  }, []);

  const cargarPedidos = async () => {

    const pedidosFirebase =
      await obtenerPedidos();

    const pendientes =
      pedidosFirebase.filter(

        (pedido) =>
          pedido.estado === "Pendiente"

      );

    const atendidos =
      pedidosFirebase.filter(

        (pedido) =>
          pedido.estado === "Atendido"

      );

    setPedidosPendientes(
      pendientes
    );

    setPedidosAtendidos(
      atendidos
    );

  };

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

  const agregarProducto = (
    producto,
    observacion = ""
  ) => {

    const obs = observacion.trim();

    const itemExistente = pedidoActual.find(

      (item) =>

        item.id === producto.id
        &&
        item.observacion === obs

    );

    if (itemExistente) {

      setPedidoActual(

        pedidoActual.map((item) =>

          item.id === producto.id
          &&
          item.observacion === obs

            ? {

                ...item,

                cantidad:
                  item.cantidad + 1

              }

            : item

        )

      );

      return;

    }

    const nuevoItem = {

      ...producto,

      itemId: Date.now(),

      cantidad: 1,

      observacion: obs

    };

    setPedidoActual([

      ...pedidoActual,

      nuevoItem

    ]);

  };

  const quitarProducto = (itemId) => {

    const actualizado = pedidoActual

      .map((item) =>

        item.itemId === itemId

          ? {

              ...item,

              cantidad:
                item.cantidad - 1

            }

          : item

      )

      .filter(

        (item) =>

          item.cantidad > 0

      );

    setPedidoActual(actualizado);

  };

  const totalPedido = pedidoActual.reduce(

    (total, item) =>

      total +
      item.precio * item.cantidad,

    0

  );

  const confirmarPedido = async () => {

    if (pedidoActual.length === 0) {

      alert(
        "Agrega productos primero"
      );

      return;

    }

    if (pedidoEditando) {

      await actualizarPedido(

        pedidoEditando.firebaseId,

        {

          productos: pedidoActual,

          total: totalPedido,

          metodoPago,

          fecha:
            new Date().toLocaleString()

        }

      );

      await cargarPedidos();

      setPedidoActual([]);

      setPedidoEditando(null);

      setMetodoPago("Efectivo");

      setPantalla("pedidos");

      return;

    }

    const nuevoPedido = {

      id: Date.now(),

      numero:

        pedidosPendientes.length
        +
        pedidosAtendidos.length
        +
        1,

      productos: pedidoActual,

      total: totalPedido,

      metodoPago,

      estado: "Pendiente",

      fecha:
        new Date().toLocaleString()

    };

    await guardarPedido(
      nuevoPedido
    );

    await cargarPedidos();

    setPedidoActual([]);

    setMetodoPago("Efectivo");

    setPantalla("pedidos");

  };

  const editarPedido = (pedido) => {

    setPedidoEditando(pedido);

    setPedidoActual(
      pedido.productos
    );

    setMetodoPago(

      pedido.metodoPago
      ||
      "Efectivo"

    );

    setPantalla("menu");

  };

  const marcarAtendido = async (
    idPedido
  ) => {

    const pedido = pedidosPendientes.find(

      (pedido) =>
        pedido.id === idPedido

    );

    if (!pedido) return;

    await actualizarPedido(

      pedido.firebaseId,

      {

        estado: "Atendido",

        fechaAtendido:
          new Date().toLocaleString()

      }

    );

    await cargarPedidos();

  };

  if (pantalla === "login") {

    return (

      <Login
        iniciarSesion={
          iniciarSesion
        }
      />

    );

  }

  if (pantalla === "dashboard") {

    return (

      <Dashboard
        usuarioActivo={
          usuarioActivo
        }
        cambiarPantalla={
          setPantalla
        }
        cerrarSesion={
          cerrarSesion
        }
        pedidosPendientes={
          pedidosPendientes
        }
        pedidosAtendidos={
          pedidosAtendidos
        }
      />

    );

  }

  if (pantalla === "menu") {

    return (

      <Menu
        cambiarPantalla={
          setPantalla
        }
        pedidoActual={
          pedidoActual
        }
        agregarProducto={
          agregarProducto
        }
        quitarProducto={
          quitarProducto
        }
        confirmarPedido={
          confirmarPedido
        }
        totalPedido={
          totalPedido
        }
        pedidoEditando={
          pedidoEditando
        }
        metodoPago={
          metodoPago
        }
        setMetodoPago={
          setMetodoPago
        }
      />

    );

  }

  if (pantalla === "pedidos") {

    return (

      <Pedidos
        cambiarPantalla={
          setPantalla
        }
        pedidosPendientes={
          pedidosPendientes
        }
        pedidosAtendidos={
          pedidosAtendidos
        }
        marcarAtendido={
          marcarAtendido
        }
        editarPedido={
          editarPedido
        }
      />

    );

  }

  if (pantalla === "ventas") {

    return (

      <Ventas
        cambiarPantalla={
          setPantalla
        }
        pedidosAtendidos={
          pedidosAtendidos
        }
      />

    );

  }

}

export default App;