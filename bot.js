const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("./config/config")

client.on('ready', () => {
    console.log("Connected als " + client.user.tag)

    console.log("Connected zu: ")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    })
    client.user.setActivity("auf Nachrichten", { type: "WATCHING" })
})

client.login(config.clientToken)