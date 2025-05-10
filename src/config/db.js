const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'college_attendance',
    password: 'githendra',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};