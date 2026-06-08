import api from "./api";

export const obtenerPedidos = async () => {
  const respuesta = await api.get("/pedidos");
  return respuesta.data;
};

export const guardarPedido = async (pedido) => {
  const respuesta = await api.post("/pedidos", pedido);
  return respuesta.data;
};

export const actualizarPedidoCompleto = async (id, pedido) => {
  const respuesta = await api.put(`/pedidos/${id}`, pedido);
  return respuesta.data;
};

export const actualizarPedido = async (id, estado) => {
  const respuesta = await api.put(`/pedidos/${id}/estado`, { estado });
  return respuesta.data;
};

export const eliminarPedido = async (id) => {
  const respuesta = await api.delete(`/pedidos/${id}`);
  return respuesta.data;
};

export const cerrarDia = async () => {
  const respuesta = await api.put("/cierrediario");
  return respuesta.data;
};

export const obtenerHistorialPorFecha = async (fecha) => {
  const respuesta = await api.get(`/historial?fecha=${fecha}`);
  return respuesta.data;
};