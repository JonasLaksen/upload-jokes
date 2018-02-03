const pgp = require('pg-promise')(), db = pgp(process.env.DATABASE_URL);
module.exports = db;
