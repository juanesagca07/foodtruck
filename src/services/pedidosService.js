import {

  collection,

  addDoc,

  updateDoc,

  doc,

  onSnapshot

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

export const escucharPedidos = (
  callback
) => {

  return onSnapshot(

    pedidosCollection,

    (snapshot) => {

      const pedidos = snapshot.docs.map(

        (doc) => ({

          firebaseId: doc.id,

          ...doc.data()

        })

      );

      callback(pedidos);

    }

  );

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