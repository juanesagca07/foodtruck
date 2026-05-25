import express from "express";
import cors from "cors";

import { initializeApp } from "firebase/app";

import {

  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc

} from "firebase/firestore";

const app = express();

app.use(cors());

app.use(express.json());

const firebaseConfig = {

  apiKey: "AIzaSyDmOzEfXJbB8CXCvl4UpV0uF-0w4aHVTGw",

  authDomain:
    "foodtruck-pos-2e3d6.firebaseapp.com",

  projectId:
    "foodtruck-pos-2e3d6",

  storageBucket:
    "foodtruck-pos-2e3d6.firebasestorage.app",

  messagingSenderId:
    "13035774283",

  appId:
    "1:13035774283:web:f5adff9edcbfee9b9cc8ce"

};

const firebaseApp =
  initializeApp(firebaseConfig);

const db =
  getFirestore(firebaseApp);

const pedidosRef =
  collection(db, "pedidos");

app.get("/", (req, res) => {

  res.json({

    mensaje:
      "API FoodTruck funcionando"

  });

});

app.get("/pedidos", async (req, res) => {

  try {

    const snapshot =
      await getDocs(pedidosRef);

    const pedidos =
      snapshot.docs.map((doc) => ({

        firebaseId: doc.id,

        ...doc.data()

      }));

    res.json(pedidos);

  } catch (error) {

    res.status(500).json({

      mensaje:
        "Error obteniendo pedidos",

      error: error.message

    });

  }

});

app.post("/pedidos", async (req, res) => {

  try {

    const nuevoPedido = {

      ...req.body,

      fecha:
        new Date().toLocaleString(),

      estado:
        req.body.estado
        ||
        "Pendiente"

    };

    const respuesta =
      await addDoc(

        pedidosRef,

        nuevoPedido

      );

    res.status(201).json({

      mensaje:
        "Pedido creado correctamente",

      firebaseId:
        respuesta.id,

      pedido:
        nuevoPedido

    });

  } catch (error) {

    res.status(500).json({

      mensaje:
        "Error creando pedido",

      error: error.message

    });

  }

});

app.put("/pedidos/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const pedidoRef = doc(
      db,
      "pedidos",
      id
    );

    await updateDoc(
      pedidoRef,
      req.body
    );

    res.json({

      mensaje:
        "Pedido actualizado",

      firebaseId: id

    });

  } catch (error) {

    res.status(500).json({

      mensaje:
        "Error actualizando pedido",

      error: error.message

    });

  }

});

const PORT = 3000;

app.listen(PORT, () => {

  console.log(

    `Servidor ejecutándose en:
     http://localhost:${PORT}`

  );

});