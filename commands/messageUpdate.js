const config = require("../config/config");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {

        if (params.message.channel.id === config.gitdates) return;

        if (params.message.edits[0] === params.message.content) return;

        if (params.message.author.bot) return;

        if (params.logChannel) {

            // Nicht auf eigene Nachrichten antworten (kam vor)
            if (params.message.author === params.client.user) return;

            let linkMessage = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id + "/" + params.message.id;
            // Embed generieren
            let messageUpdate = new Discord.RichEmbed()
                .setTitle("Nachricht editiert!")
                .setColor(0x30add3)
                .setDescription("Ursprüngliche Nachricht:\n ```" + params.message.edits[0] + "```\n" + "[Zum Beitrag]" + "(" + linkMessage + ")")
                .setFooter(config.appName + " " + config.version)
                .setTimestamp();

            // Nachrichten senden, zuerst oben, dann unten
            params.logChannel.send({ embed: messageUpdate });
        }
    }
};