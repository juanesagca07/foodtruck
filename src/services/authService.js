import api from "./api";

export const login = async (credenciales) => {
  const respuesta = await api.post("/login", credenciales);
  return respuesta.data;
};

export const loginUsuario = async (credenciales) => {
  const respuesta = await api.post("/login", credenciales);
  return respuesta.data;
};