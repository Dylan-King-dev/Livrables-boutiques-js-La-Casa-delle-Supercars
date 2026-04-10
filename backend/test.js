const mysql = require('mysql2/promise');

async function test() {
    try {
        const conn = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'boutique_auto',
        });
        console.log('Connected!');
        await conn.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();