// Discord Client erstellen
const Discord = require('discord.js');
const client = new Discord.Client();

// Config holen
const config = require("./config/config");

client.on('ready', () => {

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
    // LOG Channel holen
    const logChannel = client.channels.get(config.logChannel);

    // Embed generieren
    let messageDeleteE = new Discord.RichEmbed()
        .setTitle("Nachricht gelöscht!")
        .setColor(0x00AE86)
        .addField("Channel", message.channel.name + "/" + message.channel.id)
        .addField("Server", message.guild.name + "/" + message.guild.id)
        .addField("Nachricht", "```" + message.content + "```");

    // Nachricht senden
    logChannel.send({ embed: messageDeleteE });
});

// LOG für bearbeitete Nachricht
client.on('messageUpdate', (message) => {

    // Nicht auf eigene Nachrichten antworten (kam vor)
    if (message.author === client.user) return;

    // LOG Channel getten
    const logChannel = client.channels.get(config.logChannel);

    // Embed generieren
    let messageUpdateE = new Discord.RichEmbed()
        .setTitle("Nachrichtenverlauf")
        .setColor(0x30add3)
        .addField("Before:", "```" + message.edits[0] + "```")
        .setFooter("Discord Log Bot " + config.version)
        .addField("Channel", message.channel.name + "/" + message.channel.id)
        .addField("Server", message.guild.name + "/" + message.guild.id)
        .setTimestamp();

    // Nachrichten senden, zuerst oben, dann unten
    logChannel.send("Eine Nachricht wurde in " + message.channel.name + "/" + message.channel.id + " bearbeitet")
        .then(() => logChannel.send({ embed: messageUpdateE }));
});


client.login(config.clientToken);