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

// Commands
client.on("message", async(message) => {

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    // Prävention: Bot kann nicht auf seine eigenen Nachrichten antworten
    if (message.author.bot) return;

    // shutdown Command
    if (message.content === config.prefix + "shutdown") {
        require("./commands/shutdown").do({
            message: message,
            logChannel: logChannel
        });
    }

    // BAN Command
    if (message.content.startsWith(config.prefix + "ban")) {
        require("./commands/ban").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // HELP Command
    if (message.content === config.prefix + "help") {
        require("./commands/help").do({
            message: message,
            prefix: config.prefix
        });
    }

    // MUTE Command
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

    // KICK Command
    if (message.content.startsWith(config.prefix + "kick")) {
        require("./commands/kick").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // WARN Command
    if (message.content.startsWith(config.prefix + "warn")) {
        require("./commands/warn").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // USER Command (zeigt Infos z.B.: Mutes, Warns etc)
    if (message.content.startsWith(config.prefix + "user")) {
        require("./commands/user").do({
            message: message,
            logChannel: logChanel
        });
    }

    // Easter Egg :)
    if (message.content === config.prefix + "random") {
        require("./commands/random").do({
            message: message
        });
    }

    if (message.content === config.prefix + "le") {
        let emojiList = message.guild.emojis.map(e => e.toString()).join(" ");
        await message.channel.send(emojiList);
    }

    if (message.content.startsWith(config.prefix + "tempmute")) {
        require("./commands/tempmute").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g),
            logChannel: logChannel
        });
    }

    if (message.content.startsWith(config.prefix + "ticket")) {
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g)
        let cmdPartTwo = args[1]

        if (cmdPartTwo === "-new") {
            require("./commands/ticket-new").do({
                message: message,
                args: args,
                logChannel: logChannel
            });
        } else if (cmdPartTwo === "-add") {
            console.log("-add")
        } else if (cmdPartTwo === "-close") {
            console.log("-close")
        }
    }
});

// Connecten zu Discord
client.login(config.clientToken);