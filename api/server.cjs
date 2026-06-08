const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db.cjs");

const app = express();
const PORT = 3001;
const SECRET_KEY = "foodtruck_secret_key";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST FoodTruck funcionando correctamente",
    version: "Backend estable 1.0",
  });
});

// ========================================
// LOGIN
// ========================================

app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        error: "Usuario y contraseña son obligatorios",
      });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Credenciales incorrectas",
      });
    }

    const user = rows[0];

    const passwordValida = user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!passwordValida) {
      return res.status(401).json({
        error: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol,
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Inicio de sesión correcto",
      token,
      usuario: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en login",
      detalle: error.message,
    });
  }
});

// ========================================
// USUARIOS
// ========================================

app.get("/usuarios", async (req, res) => {
  try {
    const [usuarios] = await db
      .promise()
      .query("SELECT id, usuario, rol FROM usuarios ORDER BY id DESC");

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Error al consultar usuarios",
      detalle: error.message,
    });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    if (!usuario || !password || !rol) {
      return res.status(400).json({
        error: "Usuario, contraseña y rol son obligatorios",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db
      .promise()
      .query("INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)", [
        usuario,
        passwordHash,
        rol,
      ]);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear usuario",
      detalle: error.message,
    });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, password, rol } = req.body;

    if (!usuario || !rol) {
      return res.status(400).json({
        error: "Usuario y rol son obligatorios",
      });
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);

      await db.promise().query(
        "UPDATE usuarios SET usuario = ?, password = ?, rol = ? WHERE id = ?",
        [usuario, passwordHash, rol, id]
      );
    } else {
      await db
        .promise()
        .query("UPDATE usuarios SET usuario = ?, rol = ? WHERE id = ?", [
          usuario,
          rol,
          id,
        ]);
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar usuario",
      detalle: error.message,
    });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db
      .promise()
      .query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar usuario",
      detalle: error.message,
    });
  }
});

// ========================================
// PRODUCTOS
// ========================================

app.get("/productos", async (req, res) => {
  try {
    const [productos] = await db.promise().query(`
      SELECT *
      FROM productos
      ORDER BY
        CASE categoria
          WHEN 'Burger' THEN 1
          WHEN 'Arepas' THEN 2
          WHEN 'Papas' THEN 3
          WHEN 'Hot Dogs' THEN 4
          WHEN 'Chuzos' THEN 5
          WHEN 'Otros' THEN 6
          ELSE 7
        END,
        id ASC
    `);

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error al consultar productos",
      detalle: error.message,
    });
  }
});

app.post("/productos", async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen, disponible } =
      req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({
        error: "Nombre, precio y categoría son obligatorios",
      });
    }

    const [result] = await db.promise().query(
      `
      INSERT INTO productos
      (nombre, descripcion, precio, categoria, imagen, disponible)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        descripcion || "",
        precio,
        categoria,
        imagen || "logo.png",
        disponible === false ? 0 : 1,
      ]
    );

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear producto",
      detalle: error.message,
    });
  }
});

app.put("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, imagen, disponible } =
      req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({
        error: "Nombre, precio y categoría son obligatorios",
      });
    }

    const [result] = await db.promise().query(
      `
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagen = ?, disponible = ?
      WHERE id = ?
      `,
      [
        nombre,
        descripcion || "",
        precio,
        categoria,
        imagen || "logo.png",
        disponible ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar producto",
      detalle: error.message,
    });
  }
});

app.put("/productos/:id/disponibilidad", async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;

    const [result] = await db.promise().query(
      "UPDATE productos SET disponible = ? WHERE id = ?",
      [disponible ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Disponibilidad actualizada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar disponibilidad",
      detalle: error.message,
    });
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db
      .promise()
      .query("DELETE FROM productos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar producto",
      detalle: error.message,
    });
  }
});

// ========================================
// PEDIDOS
// ========================================

app.get("/pedidos", async (req, res) => {
  try {

    const [pedidos] = await db
      .promise()
      .query(`
        SELECT *
        FROM pedidos
        WHERE cerrado = 0
        ORDER BY fecha DESC
      `);

    for (const pedido of pedidos) {

      const [detalle] = await db
        .promise()
        .query(
          `
          SELECT *
          FROM detalle_pedidos
          WHERE pedido_id = ?
          `,
          [pedido.id]
        );

      pedido.productosPedido = detalle;
      pedido.productos = detalle;
    }

    res.json(pedidos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo pedidos",
    });
  }
});
app.post("/pedidos", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const { cliente, productosPedido, total, metodoPago } = req.body;

    if (
      !cliente ||
      !Array.isArray(productosPedido) ||
      productosPedido.length === 0 ||
      !total ||
      !metodoPago
    ) {
      connection.release();

      return res.status(400).json({
        error: "Cliente, productos, total y método de pago son obligatorios",
      });
    }

    await connection.beginTransaction();

    const [pedidoResult] = await connection.query(
      `
      INSERT INTO pedidos
      (cliente, total, metodo_pago, estado)
      VALUES (?, ?, ?, 'Pendiente')
      `,
      [cliente, total, metodoPago]
    );

    const pedidoId = pedidoResult.insertId;

    for (const producto of productosPedido) {
      await connection.query(
        `
        INSERT INTO detalle_pedidos
        (pedido_id, producto_id, nombre_producto, cantidad, precio, observacion)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          pedidoId,
          producto.producto_id || producto.id || null,
          producto.nombre || producto.nombre_producto,
          producto.cantidad,
          producto.precio,
          producto.observacion || "",
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedido: {
        id: pedidoId,
        cliente,
        productosPedido,
        total,
        metodoPago,
        estado: "Pendiente",
      },
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      error: "Error al crear pedido",
      detalle: error.message,
      sql: error.sqlMessage,
      codigo: error.code,
    });
  } finally {
    connection.release();
  }
});

app.put("/pedidos/:id", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const { id } = req.params;
    const { cliente, productosPedido, total, metodoPago } = req.body;

    const [pedidos] = await connection.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [id]
    );

    if (pedidos.length === 0) {
      connection.release();

      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const pedidoActual = pedidos[0];

    if (pedidoActual.estado === "Entregado" || pedidoActual.estado === "Atendido") {
      connection.release();

      return res.status(403).json({
        error: "Los pedidos atendidos no se pueden modificar",
      });
    }

    if (
      !cliente ||
      !Array.isArray(productosPedido) ||
      productosPedido.length === 0 ||
      !total ||
      !metodoPago
    ) {
      connection.release();

      return res.status(400).json({
        error: "Cliente, productos, total y método de pago son obligatorios",
      });
    }

    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE pedidos
      SET cliente = ?, total = ?, metodo_pago = ?
      WHERE id = ?
      `,
      [cliente, total, metodoPago, id]
    );

    await connection.query("DELETE FROM detalle_pedidos WHERE pedido_id = ?", [
      id,
    ]);

    for (const producto of productosPedido) {
      await connection.query(
        `
        INSERT INTO detalle_pedidos
        (pedido_id, producto_id, nombre_producto, cantidad, precio, observacion)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          producto.producto_id || producto.id || null,
          producto.nombre || producto.nombre_producto,
          producto.cantidad,
          producto.precio,
          producto.observacion || "",
        ]
      );
    }

    await connection.commit();

    res.json({
      mensaje: "Pedido actualizado correctamente",
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      error: "Error al actualizar pedido",
      detalle: error.message,
      sql: error.sqlMessage,
      codigo: error.code,
    });
  } finally {
    connection.release();
  }
});

app.put("/pedidos/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: "El estado es obligatorio",
      });
    }

    const [pedidos] = await db
      .promise()
      .query("SELECT * FROM pedidos WHERE id = ?", [id]);

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const pedidoActual = pedidos[0];

    if (pedidoActual.estado === "Entregado" || pedidoActual.estado === "Atendido") {
      return res.status(403).json({
        error: "Los pedidos atendidos no se pueden volver a modificar",
      });
    }

    await db
      .promise()
      .query("UPDATE pedidos SET estado = ? WHERE id = ?", ["Entregado", id]);

    res.json({
      mensaje: "Pedido marcado como atendido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar pedido",
      detalle: error.message,
    });
  }
});

app.put("/pedidos/:id/atendido", async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await db
      .promise()
      .query("SELECT * FROM pedidos WHERE id = ?", [id]);

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const pedidoActual = pedidos[0];

    if (pedidoActual.estado === "Entregado" || pedidoActual.estado === "Atendido") {
      return res.status(403).json({
        error: "Los pedidos atendidos no se pueden volver a modificar",
      });
    }

    await db
      .promise()
      .query("UPDATE pedidos SET estado = ? WHERE id = ?", ["Entregado", id]);

    res.json({
      mensaje: "Pedido marcado como atendido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al marcar pedido como atendido",
      detalle: error.message,
    });
  }
});

app.delete("/pedidos/:id", async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const { id } = req.params;

    const [pedidos] = await connection.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [id]
    );

    if (pedidos.length === 0) {
      connection.release();

      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const pedidoActual = pedidos[0];

    if (pedidoActual.estado === "Entregado" || pedidoActual.estado === "Atendido") {
      connection.release();

      return res.status(403).json({
        error: "Los pedidos atendidos no se pueden eliminar",
      });
    }

    await connection.beginTransaction();

    await connection.query("DELETE FROM detalle_pedidos WHERE pedido_id = ?", [
      id,
    ]);

    await connection.query("DELETE FROM pedidos WHERE id = ?", [id]);

    await connection.commit();

    res.json({
      mensaje: "Pedido eliminado correctamente",
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      error: "Error al eliminar pedido",
      detalle: error.message,
    });
  } finally {
    connection.release();
  }
});

// ========================================
// CIERRE DIARIO
// ========================================

app.put("/cierrediario", async (req, res) => {
  try {
    await db.promise().query(`
      UPDATE pedidos
      SET
        cerrado = 1,
        fecha_cierre = NOW()
      WHERE estado IN ('Entregado', 'Atendido')
        AND cerrado = 0
    `);

    res.json({
      mensaje: "Cierre diario realizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error realizando cierre diario",
      detalle: error.message,
    });
  }
});

// ========================================
// HISTORIAL POR FECHA
// ========================================

app.get("/historial", async (req, res) => {
  try {

    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        error: "La fecha es obligatoria",
      });
    }

    const [pedidos] = await db.promise().query(
      `
      SELECT *
      FROM pedidos
      WHERE cerrado = 1
      AND DATE(fecha_cierre) = ?
      ORDER BY fecha_cierre DESC
      `,
      [fecha]
    );

    for (const pedido of pedidos) {

      const [detalle] = await db.promise().query(
        `
        SELECT *
        FROM detalle_pedidos
        WHERE pedido_id = ?
        `,
        [pedido.id]
      );

      pedido.productosPedido = detalle;
      pedido.productos = detalle;
    }

    res.json(pedidos);

  } catch (error) {

    res.status(500).json({
      error: "Error consultando historial",
      detalle: error.message,
    });
  }
});

// ========================================
// VENTAS
// ========================================

app.get("/ventas/resumen", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
      SELECT COUNT(*) AS totalPedidos, SUM(total) AS totalVentas
      FROM pedidos
      WHERE estado = 'Entregado' OR estado = 'Atendido'
      `
    );

    res.json({
      totalPedidos: rows[0].totalPedidos || 0,
      totalVentas: rows[0].totalVentas || 0,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al consultar ventas",
      detalle: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`API REST FoodTruck ejecutándose en http://localhost:${PORT}`);
});