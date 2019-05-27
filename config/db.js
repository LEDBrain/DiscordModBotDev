const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql");

let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) throw err;

    db.query("CREATE TABLE IF NOT EXISTS `warnungen` (`id` VARCHAR(255) NOT NULL PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `warns` TINYINT(255) NOT NULL DEFAULT 0)");
    db.query("CREATE TABLE IF NOT EXISTS `mute` (`id` VARCHAR(255) NOT NULL PRIMARY KEY, `username` VARCHAR(255) NOT NULL, `mutes` TINYINT(255) NOT NULL DEFAULT 0)");
    db.query("CREATE TABLE IF NOT EXISTS `tickets` (`guildID` VARCHAR(255) NOT NULL PRIMARY KEY, `tNumber` TINYINT(255) NOT NULL DEFAULT 0)");

    console.log("Connected to DB");
});

module.exports = db;