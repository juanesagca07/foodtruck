import api from "./api";

export const obtenerUsuarios = async () => {
  const respuesta = await api.get("/usuarios");
  return respuesta.data;
};

export const crearUsuario = async (usuario) => {
  const respuesta = await api.post("/usuarios", usuario);
  return respuesta.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const respuesta = await api.put(`/usuarios/${id}`, usuario);
  return respuesta.data;
};

export const eliminarUsuario = async (id) => {
  const respuesta = await api.delete(`/usuarios/${id}`);
  return respuesta.data;
};