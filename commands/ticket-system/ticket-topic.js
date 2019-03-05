const Discord = require("discord.js");
const config = require("../../config/config");

module.exports = {
    do: async function(params) {

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Bitte führe diesen Command in einem Ticket-Channel aus!");

        if (!params.message.member.roles.has(config.staffrole)) {
            require("../commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        let topic = params.args.slice(2).join(" ");

        await params.message.channel.setTopic(topic, "Ticket Topic set/changed");

        let linkChannel = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id;

        let scTopicEmbed = new Discord.RichEmbed()
            .setTitle("Das Thema wurde gesetzt/verändert!")
            .setColor()
            .addField("User", params.message.author.toString())
            .addField("Neues Thema", "```" + topic + "```")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp()

        let topicEmbed = new Discord.RichEmbed()
            .setTitle("Das Thema eines Tickets wurde gesetzt/verändert!")
            .setColor()
            .setDescription("[Ticket](" + linkChannel + ")")
            .addField("User", params.message.author.toString())
            .addField("Neues Thema", "```" + topic + "```")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp()

        await params.message.channel.send({ embed: scTopicEmbed });
        await params.logChannel.send({ embed: topicEmbed });
    }
}