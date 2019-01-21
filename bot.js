import { Client, DiscordAPIError } from 'discord.js'
const client = new Client()
import { clientToken } from './config/config.js'
var logChannel = client.channels.get(config.logChannel)

client.on('ready', () => {
    console.log("Verbunden als " + client.user.tag)

    console.log("Verbunden zu: ")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    })
    client.user.setActivity("auf Nachrichten", { type: "WATCHING" })
})

client.on('messageDelete', (message) => {
    logChannel.send("Eine Nachricht wurde in " + message.channel.name + "/" + message.channel.id + " mit dem Inhalt " + message.content + "wurde gelöscht!")
})

client.on('messageUpdate', (message) => {
    let messageUpdateE = new Discord.RichEmbed()
        .setTitle("Message History")
        .setColor(0x30add3)
        .addField("Messages:", message.edits)
        .setTimestamp()

    logChannel.send("Eine Nachricht wurde in " + message.channel.name + "/" + message.channel.id + "bearbeitet")
        .then(() => logChannel.send({ embed: messageUpdateE }))
})

client.login(clientToken)

//TODO: Testing!!
//TODO: Push
//TODO: Projekt Board GitHub!