const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("./config/config")

client.on('ready', () => {
    console.log("Verbunden als " + client.user.tag)

    console.log("Verbunden zu: ")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    })
    client.user.setActivity("auf Nachrichten", { type: "WATCHING" })
})

client.on('messageDelete', (message) => {
    const logChannel = client.channels.get(config.logChannel)

    let messageDeleteE = new Discord.RichEmbed()
        .setTitle("Nachricht gelöscht!")
        .setColor(0x00AE86)
        .addField("Channel", message.channel.name + "/" + message.channel.id, true)
        .addField("Nachricht", "```" + message.content + "```", true)

    logChannel.send({ embed: messageDeleteE })
})

client.on('messageUpdate', (message) => {
    if (message.author === client.user) return
    const logChannel = client.channels.get(config.logChannel)

    let messageUpdateE = new Discord.RichEmbed()
        .setTitle("Nachrichtenverlauf")
        .setColor(0x30add3)
        .addField("Before:", "```" + message.edits[0] + "```")
        .setFooter("Discord Log Bot " + config.version)
        .setTimestamp()


    logChannel.send("Eine Nachricht wurde in " + message.channel.name + "/" + message.channel.id + " bearbeitet")
        .then(() => logChannel.send({ embed: messageUpdateE }))
})

client.login(config.clientToken)