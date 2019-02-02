const mysql = require('mysql');

let db = mysql.createConnection({
    host: "localhost",
    user: "mod",
    password: "wA38K5a!",
    database: "mod"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB");

    db.query("CREATE TABLE IF NOT EXISTS `warnungen` (`id` VARCHAR(255) NOT NULL PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `warns` TINYINT(255) NOT NULL DEFAULT 0)");
});

module.exports = db;