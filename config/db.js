const mysql = require('mysql2');
const dbConfig = require("./config.js");
const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: dbConfig.PORT
});

module.exports = pool.promise();