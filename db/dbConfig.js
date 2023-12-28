const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: "evangadi-admin",
  database: "evangadi_db",
  host: "localhost",
  password: "123456",
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
