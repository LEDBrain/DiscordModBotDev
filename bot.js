// Discord Client erstellen
const Discord = require("discord.js");
const client = new Discord.Client();

//Erster LOG Channel schritt
let logChannel;

// Config holen
const config = require("./config/config");

const events = {
    MESSAGE_UPDATE: "messageUpdate",
    MESSAGE_DELETE: "messageDelete"
}

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
    client.user.setActivity("auf Nachrichten.", { type: "WATCHING" });
});

client.on("guildMemberAdd", (member) => {
    require("./commands/guildMemberAdd").do({
        member: member,
        logChannel: logChannel
    });
});

client.on("guildMemberRemove", (member) => {
    require("./commands/guildMemberRemove").do({
        member: member,
        logChannel: logChannel
    });
});

// LOG für eine gelöschte Nachricht
client.on("messageDelete", (message) => {
    require("./commands/messageDelete").do({
        message: message,
        logChannel: logChannel
    });
});

// LOG für bearbeitete Nachricht
client.on("messageUpdate", (oldMessage, newMessage, message) => {
    require("./commands/messageUpdate").do({
        oldMessage: oldMessage,
        newMessage: newMessage,
        logChannel: logChannel,
        message: message
    });
});

client.on("raw", async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;

    const user = client.users.get(data.user_id);

    const channel = client.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);

    client.emit(events[event.t], channel, user, message);
});

// Commands
client.on("message", async(message) => {

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    // Prävention: Bot kann nicht auf seine eigenen Nachrichten antworten
    if (message.author.bot) return;

    // shutdown Command
    if (message.content === `${config.prefix}shutdown`) {
        require("./commands/shutdown").do({
            message: message,
            logChannel: logChannel,
            client: client
        });
    }

    if (message.content.startsWith(`${config.prefix}eval`)) {
        require("./commands/eval").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // BAN Command
    if (message.content.startsWith(`${config.prefix}ban`)) {
        require("./commands/ban").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // HELP Command
    if (message.content === `${config.prefix}help`) {
        require("./commands/help").do({
            message: message
        });
    }

    // MUTE Command
    if (message.content.startsWith(`${config.prefix}mute`)) {
        require("./commands/mute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // UNMUTE Command
    if (message.content.startsWith(`${config.prefix}unmute`)) {
        require("./commands/unmute").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // KICK Command
    if (message.content.startsWith(`${config.prefix}kick`)) {
        require("./commands/kick").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // WARN Command
    if (message.content.startsWith(`${config.prefix}warn`)) {
        require("./commands/warn").do({
            message: message,
            logChannel: logChannel,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g)
        });
    }

    // USER Command (zeigt Infos z.B.: Mutes, Warns etc)
    if (message.content.startsWith(`${config.prefix}user`)) {
        require("./commands/user").do({
            message: message,
            logChannel: logChanel
        });
    }

    // Easter Egg :)
    if (message.content === `${config.prefix}random`) {
        require("./commands/random").do({
            message: message
        });
    }

    if (message.content === `${config.prefix}le`) {
        let emojiList = message.guild.emojis.map(e => e.toString()).join(" ");
        await message.channel.send(emojiList);
    }

    if (message.content.startsWith(`${config.prefix}tempmute`)) {
        require("./commands/tempmute").do({
            message: message,
            args: message.content.slice(config.prefix.length).trim().split(/ +/g),
            logChannel: logChannel
        });
    }

    if (message.content.startsWith(`${config.prefix}ticket`)) {
        let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        let cmdPartTwo = args[1];

        if (cmdPartTwo === "new") {
            require("./commands/ticket-system/ticket-new").do({
                message: message,
                args: args,
                logChannel: logChannel
            });
        } else if (cmdPartTwo === "add") {
            require("./commands/ticket-system/ticket-add").do({
                message: message,
                args: args,
                logChannel: logChannel
            });
        } else if (cmdPartTwo === "close") {
            require("./commands/ticket-system/ticket-close").do({
                message: message,
                args: args,
                logChannel: logChannel
            });
        } else if (cmdPartTwo === "topic") {
            require("./commands/ticket-system/ticket-topic").do({
                message: message,
                args: args,
                logChannel: logChannel
            });
        }
    }
});

// Connecten zu Discord
client.login(config.clientToken);