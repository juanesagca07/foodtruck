import api from "./api";

export const obtenerProductos = async () => {
  const respuesta = await api.get("/productos");
  return respuesta.data;
};

export const crearProducto = async (producto) => {
  const respuesta = await api.post("/productos", producto);
  return respuesta.data;
};

export const actualizarProducto = async (id, producto) => {
  const respuesta = await api.put(`/productos/${id}`, producto);
  return respuesta.data;
};

export const cambiarDisponibilidadProducto = async (id, disponible) => {
  const respuesta = await api.put(`/productos/${id}/disponibilidad`, {
    disponible,
  });

  return respuesta.data;
};

export const eliminarProducto = async (id) => {
  const respuesta = await api.delete(`/productos/${id}`);
  return respuesta.data;
};