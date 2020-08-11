// Get the client
const mysql = require('mysql2');

// create the connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3301,
    user: 'root',
    database: 'test'
});

connection.query('SELECT 1+1 as test1', (err, rows) => {
    //
});

module.exports = connection;