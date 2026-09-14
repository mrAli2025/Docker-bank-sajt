import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: 8889, // MAMP:s standardport för MySQL, ändra om din är annorlunda
    user: 'root',
    password: 'root', // MAMP:s standardlösenord, ändra om du satt ett annat
    database: 'Bank',
});

export default pool;