// Discord Client erstellen
const Discord = require("discord.js");
const client = new Discord.Client();
const async = require("async");

//Erster LOG Channel schritt
let logChannel;

// Config holen
const config = require("./config/config");

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
client.on("messageDelete", (message) => {

    require("./commands/messageDelete").do({
        message: message,
        logChannel: logChannel
    });
});

// LOG für bearbeitete Nachricht
client.on("messageUpdate", (message) => {

    require("./commands/messageUpdate").do({
        message: message,
        logChannel: logChannel,
        client: client
    });
});

client.on("message", async (message) => {

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    if (message.author.bot) return;

    if (message.content.startsWith(config.prefix + "ban")) {

        require("./commands/ban").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content === config.prefix + "help") {

        require("./commands/help").do({
            message: message,
            prefix: config.prefix
        });
    }

    // Warten auf ne mute Nachricht
    if (message.content.startsWith(config.prefix + "mute")) {

        require("./commands/mute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // UNMUTE Command
    if (message.content.startsWith(config.prefix + "unmute")) {

        require("./commands/unmute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "kick")) {

        require("./commands/kick").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "warn")) {

        require("./commands/warn").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    if (message.content.startsWith(config.prefix + "seewarns")) {

        require("./commands/seewarns").do({
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
