const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.dbHost,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database : process.env.database
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;
