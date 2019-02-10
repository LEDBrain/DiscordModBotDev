// Discord Client erstellen
const Discord = require("discord.js");
const client = new Discord.Client();

//Erster LOG Channel schritt
let logChannel;

// Config holen
const config = require("./config/config");

// DB
const db = require("./config/db");

client.on("ready", () => {

    // LOG Channel holen (2. LOG Channel Schritt)
    logChannel = client.channels.get(config.logChannel);
    // Client Username anzeigen
    console.log("Verbunden als " + client.user.tag);

    // Client Server ausgeben
    console.log("Verbunden zu: ");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
    });

    // Activity auf "Schaut auf Nachrichten" setzen
    client.user.setActivity("auf Nachrichten", { type: "WATCHING" });
});

// LOG für eine gelöschte Nachricht
client.on('messageDelete', (message) => {

    if (message.author.bot) return;

    // Schauen ob der LOG Channel da ist
    if (logChannel) {

        let linkChannel = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id;
        // Embed generieren
        let messageDelete = new Discord.RichEmbed()
            .setTitle("Nachricht gelöscht!")
            .setColor(0x00AE86)
            .setDescription("Nachricht\n ```" + message.content + "```\n User\n" + message.author + "\n\n [Zum Channel]" + "(" + linkChannel + ")")
            .setFooter("Discord Log Bot " + config.version)
            .setTimestamp();

        // Nachricht senden
        logChannel.send({ embed: messageDelete });
    }
});

// LOG für bearbeitete Nachricht
client.on("messageUpdate", (message) => {
    if (message.channel.id === config.gitdates) return;

    if (message.edits[0] === message.content) return;

    if (message.author.bot) return;

    if (logChannel) {

        // Nicht auf eigene Nachrichten antworten (kam vor)
        if (message.author === client.user) return;

        // LOG Channel getten
        const logChannel = client.channels.get(config.logChannel);

        let linkMessage = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id;
        // Embed generieren
        let messageUpdate = new Discord.RichEmbed()
            .setTitle("Nachricht editiert!")
            .setColor(0x30add3)
            .setDescription("Ursprüngliche Nachricht:\n ```" + message.edits[0] + "```\n" + "[Zum Beitrag]" + "(" + linkMessage + ")")
            .setFooter("Discord Log Bot " + config.version)
            .setTimestamp();

        // Nachrichten senden, zuerst oben, dann unten
        logChannel.send({ embed: messageUpdate });
    }
});

client.on('message', (message) => {

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    if (message.author.bot) return;

    if (message.content === config.prefix + "help") {

        require("./commands/'" + "help").do({
            message: message,
            prefix: config.prefix,
        });
    }

    // Warten auf ne mute Nachricht
    if (message.content.startsWith(config.prefix + "mute")) {

        require('./commands/' + "mute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // UNMUTE Command
    if (message.content.startsWith(config.prefix + "unmute")) {

        require("./commands/" + "unmute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "kick")) {

        require("./commands/" + "kick").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "warn")) {

        require("./commands/" + "warn").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "seewarns")) {
        require("./commands" + "seewarns").do({
            message: message,
            logChannel: logChanel
        });
    }

    if (message.content === config.prefix + "random") {
        var random = Math.random();

        if (random < "0.4") {
            message.channel.send("Kopf!");
        } else if (random > "0.4") {
            message.channel.send("Zahl!");
        }
    }

});

client.login(config.clientToken);