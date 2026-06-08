const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",

  user: process.env.MYSQLUSER || "root",

  password: process.env.MYSQLPASSWORD || "1234",

  database: process.env.MYSQLDATABASE || "foodtruck_db",

  port: process.env.MYSQLPORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((error, connection) => {
  if (error) {
    console.error("Error conectando a MySQL:", error.message);
    return;
  }

  console.log("Conectado a MySQL");

  connection.release();
});

module.exports = db;