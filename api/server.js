import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ===============================
// DATOS TEMPORALES EN MEMORIA
// ===============================

let usuarios = [
  {
    id: 1,
    usuario: "admin",
    password: "1234",
    rol: "admin"
  }
];

let productos = [
  {
    id: 1,
    nombre: "Hamburguesa",
    precio: 15000,
    categoria: "Hamburguesas",
    disponible: true
  },
  {
    id: 2,
    nombre: "Perro caliente",
    precio: 12000,
    categoria: "Perros",
    disponible: true
  }
];

let pedidos = [];

// ===============================
// RUTA PRINCIPAL
// ===============================

app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST FoodTruck funcionando correctamente",
    version: "1.0"
  });
});

// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: "Usuario y contraseña son obligatorios"
    });
  }

  const usuarioEncontrado = usuarios.find(
    (item) => item.usuario === usuario && item.password === password
  );

  if (!usuarioEncontrado) {
    return res.status(401).json({
      error: "Credenciales incorrectas"
    });
  }

  res.json({
    mensaje: "Inicio de sesión correcto",
    usuario: {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol
    }
  });
});

// ===============================
// USUARIOS
// ===============================

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.post("/usuarios", (req, res) => {
  const { usuario, password, rol } = req.body;

  if (!usuario || !password || !rol) {
    return res.status(400).json({
      error: "Usuario, contraseña y rol son obligatorios"
    });
  }

  const existeUsuario = usuarios.find((item) => item.usuario === usuario);

  if (existeUsuario) {
    return res.status(409).json({
      error: "El usuario ya existe"
    });
  }

  const nuevoUsuario = {
    id: Date.now(),
    usuario,
    password,
    rol
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json({
    mensaje: "Usuario creado correctamente",
    usuario: nuevoUsuario
  });
});

// ===============================
// PRODUCTOS
// ===============================

app.get("/productos", (req, res) => {
  res.json(productos);
});

app.post("/productos", (req, res) => {
  const { nombre, precio, categoria } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({
      error: "Nombre, precio y categoría son obligatorios"
    });
  }

  if (precio <= 0) {
    return res.status(400).json({
      error: "El precio debe ser mayor a cero"
    });
  }

  const nuevoProducto = {
    id: Date.now(),
    nombre,
    precio,
    categoria,
    disponible: true
  };

  productos.push(nuevoProducto);

  res.status(201).json({
    mensaje: "Producto creado correctamente",
    producto: nuevoProducto
  });
});

app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  Object.assign(producto, req.body);

  res.json({
    mensaje: "Producto actualizado correctamente",
    producto
  });
});

app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const productoExiste = productos.some((item) => item.id === id);

  if (!productoExiste) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  productos = productos.filter((item) => item.id !== id);

  res.json({
    mensaje: "Producto eliminado correctamente"
  });
});

// ===============================
// PEDIDOS
// ===============================

app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});

app.post("/pedidos", (req, res) => {
  const { cliente, productosPedido, total, metodoPago } = req.body;

  if (!cliente || !productosPedido || !total || !metodoPago) {
    return res.status(400).json({
      error: "Cliente, productos, total y método de pago son obligatorios"
    });
  }

  if (!Array.isArray(productosPedido) || productosPedido.length === 0) {
    return res.status(400).json({
      error: "El pedido debe tener al menos un producto"
    });
  }

  if (total <= 0) {
    return res.status(400).json({
      error: "El total debe ser mayor a cero"
    });
  }

  const nuevoPedido = {
    id: Date.now(),
    cliente,
    productosPedido,
    total,
    metodoPago,
    estado: "Pendiente",
    fecha: new Date().toLocaleString()
  };

  pedidos.push(nuevoPedido);

  res.status(201).json({
    mensaje: "Pedido creado correctamente",
    pedido: nuevoPedido
  });
});

app.put("/pedidos/:id", (req, res) => {
  const id = Number(req.params.id);
  const pedido = pedidos.find((item) => item.id === id);

  if (!pedido) {
    return res.status(404).json({
      error: "Pedido no encontrado"
    });
  }

  Object.assign(pedido, req.body);

  res.json({
    mensaje: "Pedido actualizado correctamente",
    pedido
  });
});

app.put("/pedidos/:id/estado", (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  const pedido = pedidos.find((item) => item.id === id);

  if (!pedido) {
    return res.status(404).json({
      error: "Pedido no encontrado"
    });
  }

  if (!estado) {
    return res.status(400).json({
      error: "El estado es obligatorio"
    });
  }

  pedido.estado = estado;

  res.json({
    mensaje: "Estado del pedido actualizado correctamente",
    pedido
  });
});

app.delete("/pedidos/:id", (req, res) => {
  const id = Number(req.params.id);
  const pedidoExiste = pedidos.some((item) => item.id === id);

  if (!pedidoExiste) {
    return res.status(404).json({
      error: "Pedido no encontrado"
    });
  }

  pedidos = pedidos.filter((item) => item.id !== id);

  res.json({
    mensaje: "Pedido eliminado correctamente"
  });
});

// ===============================
// VENTAS
// ===============================

app.get("/ventas/resumen", (req, res) => {
  const pedidosAtendidos = pedidos.filter(
    (pedido) => pedido.estado === "Atendido"
  );

  const totalVentas = pedidosAtendidos.reduce(
    (acumulado, pedido) => acumulado + pedido.total,
    0
  );

  res.json({
    pedidosAtendidos: pedidosAtendidos.length,
    totalVentas
  });
});

// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {
  console.log(`API REST FoodTruck ejecutándose en http://localhost:${PORT}`);
});