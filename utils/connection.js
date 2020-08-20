// Get the client
const mysql = require('mysql2');
require('dotenv').config();

// create the connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

module.exports = connection;