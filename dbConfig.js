// Load environment variables
require('dotenv').config();
var mysql = require('mysql2');

var conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database connected');
});

module.exports = conn;
