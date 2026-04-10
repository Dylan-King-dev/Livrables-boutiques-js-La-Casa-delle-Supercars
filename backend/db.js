console.log('DB.JS LOADED');

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'boutique_auto',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    charset: 'utf8mb4',
});

db.getConnection()
  .then(conn => {
    console.log('Pool connected successfully!');
    conn.release();
  })
  .catch(err => console.error('Pool connection error:', err.message));

module.exports = db;