const mysql = require('mysql');
const config = require("./config");

let db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

db.connect(function(err) {
    if (err) throw err;

    db.query("CREATE TABLE IF NOT EXISTS `warnungen` (`id` VARCHAR(255) NOT NULL PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `warns` TINYINT(255) NOT NULL DEFAULT 0)");
    db.query("CREATE TABLE IF NOT EXISTS `mutes` (`id` VARCHAR(255) NOT NULL PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `mutes` TINYINT(255) NOT NULL DEFAULT 0)");

    console.log("Connected to DB");
});

module.exports = db;