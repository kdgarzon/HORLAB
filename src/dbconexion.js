
const {Pool} = require('pg')
const {db} = require('./config')

const pool = new Pool({
    user: String(db.user),
    password: String(db.password),
    host: String(db.host),
    port: Number(db.port),
    database: String(db.database)
});

console.log({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.database
});

module.exports = pool;