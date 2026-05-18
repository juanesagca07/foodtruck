import {

  collection,

  addDoc,

  getDocs,

  updateDoc,

  doc

} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const pedidosCollection = collection(
  db,
  "pedidos"
);

export const guardarPedido = async (
  pedido
) => {

  try {

    const respuesta = await addDoc(

      pedidosCollection,

      pedido

    );

    return respuesta.id;

  } catch (error) {

    console.error(
      "Error guardando pedido:",
      error
    );

  }

};

export const obtenerPedidos = async () => {

  try {

    const data = await getDocs(
      pedidosCollection
    );

    return data.docs.map((doc) => ({

      ...doc.data(),

      firebaseId: doc.id

    }));

  } catch (error) {

    console.error(
      "Error obteniendo pedidos:",
      error
    );

    return [];

  }

};

export const actualizarPedido = async (
  firebaseId,
  datos
) => {

  try {

    const pedidoRef = doc(
      db,
      "pedidos",
      firebaseId
    );

    await updateDoc(
      pedidoRef,
      datos
    );

  } catch (error) {

    console.error(
      "Error actualizando pedido:",
      error
    );

  }

};