import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import Usuarios from "./pages/Usuarios";
import Cocina from "./pages/Cocina";
import Historial from "./pages/Historial";
import Sidebar from "./components/Sidebar";

import {
  obtenerPedidos,
  guardarPedido,
  actualizarPedidoCompleto,
  actualizarPedido,
  eliminarPedido,
  cerrarDia,
} from "./services/pedidosService";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [pantalla, setPantalla] = useState("login");
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  const esPedidoAtendido = (pedido) => {
    return pedido?.estado === "Entregado" || pedido?.estado === "Atendido";
  };

  const cargarPedidos = async () => {
    try {
      const datos = await obtenerPedidos();
      setPedidos(datos);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setPedidos([]);
    }
  };

  useEffect(() => {
    const iniciarAplicacion = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");
        const tokenGuardado = localStorage.getItem("token");

        if (usuarioGuardado && tokenGuardado) {
          setUsuarioActivo(JSON.parse(usuarioGuardado));
          setPantalla("dashboard");
        }

        await cargarPedidos();
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuarioActivo(null);
        setPantalla("login");
      } finally {
        setCargando(false);
      }
    };

    iniciarAplicacion();
  }, []);

  const iniciarSesion = (usuario) => {
    setUsuarioActivo(usuario);
    setPantalla("dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuarioActivo(null);
    setPedidoEditando(null);
    setPantalla("login");
  };

  const crearPedido = async (pedido) => {
    try {
      await guardarPedido(pedido);
      await cargarPedidos();
      setPantalla("pedidos");
    } catch (error) {
      toast.error("No se pudo crear el pedido");
    }
  };

  const guardarCambiosPedido = async (id, pedido) => {
    try {
      await actualizarPedidoCompleto(id, pedido);
      await cargarPedidos();
      setPedidoEditando(null);
      setPantalla("pedidos");
    } catch (error) {
      toast.error("No se pudo actualizar el pedido");
    }
  };

  const cambiarEstadoPedido = async (id, estado) => {
    try {
      await actualizarPedido(id, estado);
      await cargarPedidos();
    } catch (error) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const borrarPedido = async (id) => {
    try {
      await eliminarPedido(id);
      await cargarPedidos();
    } catch (error) {
      toast.error("No se pudo eliminar el pedido");
    }
  };

  const realizarCierreDiario = async () => {
    const confirmar = window.confirm(
      "¿Cerrar el día? Los pedidos atendidos desaparecerán de la operación diaria, pero quedarán guardados en la base de datos."
    );

    if (!confirmar) return;

    try {
      await cerrarDia();
      await cargarPedidos();
      toast.success("Cierre diario realizado correctamente");
    } catch (error) {
      toast.error("No se pudo realizar el cierre diario");
    }
  };

  const editarPedido = (pedido) => {
    if (esPedidoAtendido(pedido)) return;

    setPedidoEditando(pedido);
    setPantalla("menu");
  };

  const rol = usuarioActivo?.rol?.toLowerCase();
  const esAdministrador = rol === "admin" || rol === "administrador";
  const esCocina = rol === "cocina";

  const navegar = (destino) => {
    if (!usuarioActivo) {
      setPantalla("login");
      return;
    }

    if (
      (destino === "usuarios" ||
        destino === "productos" ||
        destino === "ventas" ||
        destino === "historial") &&
      !esAdministrador
    ) {
      toast.error("No tienes permisos para acceder");
      return;
    }

    if (destino === "menu" && esCocina) {
      toast.error("El rol cocina no puede tomar pedidos");
      return;
    }

    if (destino !== "menu") {
      setPedidoEditando(null);
    }

    setPantalla(destino);
  };

  if (cargando) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #f2b705" } }} />

        <main className="login-page">
          <section className="login-card">
            <div className="loader-box">
              <div className="loader-spinner"></div>
              <p className="loader-text">Cargando FoodTruck...</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (!usuarioActivo || pantalla === "login") {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #f2b705" } }} />
        <Login onLogin={iniciarSesion} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #f2b705" } }} />

      <section className="app-layout">
        <Sidebar
          usuarioActivo={usuarioActivo}
          pantalla={pantalla}
          setPantalla={navegar}
          cerrarSesion={cerrarSesion}
          realizarCierreDiario={realizarCierreDiario}
        />

        <section className="app-content">
          {pantalla === "dashboard" && (
            <Dashboard
              usuarioActivo={usuarioActivo}
              pedidos={pedidos}
              setPantalla={navegar}
              cerrarSesion={cerrarSesion}
              realizarCierreDiario={realizarCierreDiario}
            />
          )}

          {pantalla === "menu" && (
            <Menu
              crearPedido={crearPedido}
              guardarCambiosPedido={guardarCambiosPedido}
              pedidoEditando={pedidoEditando}
              limpiarPedidoEditando={() => setPedidoEditando(null)}
              setPantalla={navegar}
            />
          )}

          {pantalla === "pedidos" && (
            <Pedidos
              pedidos={pedidos}
              cambiarEstadoPedido={cambiarEstadoPedido}
              borrarPedido={borrarPedido}
              editarPedido={editarPedido}
              setPantalla={navegar}
            />
          )}

          {pantalla === "cocina" && (
            <Cocina
              pedidos={pedidos}
              cambiarEstadoPedido={cambiarEstadoPedido}
              recargarPedidos={cargarPedidos}
              setPantalla={navegar}
            />
          )}

          {pantalla === "ventas" && (
            <Ventas pedidos={pedidos} setPantalla={navegar} />
          )}

          {pantalla === "productos" && <Productos setPantalla={navegar} />}

          {pantalla === "usuarios" && <Usuarios setPantalla={navegar} />}

          {pantalla === "historial" && <Historial setPantalla={navegar} />}
        </section>
      </section>
    </>
  );
}

export default App;