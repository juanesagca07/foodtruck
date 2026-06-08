const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((error, connection) => {
  if (error) {
    console.error("Error conectando a MySQL:", error.message);
    return;
  }

  console.log("Conectado a Railway MySQL");
  connection.release();
});

module.exports = db;