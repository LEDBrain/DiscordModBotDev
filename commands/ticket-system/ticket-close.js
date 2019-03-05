const Discord = require("discord.js");
const config = require("../../config/config");

module.exports = {
    do: async function(params) {

        if (params.message.channel.name === "ticket-test") return;

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Bitte führe diesen Command in einem Ticket-Channel aus!");

        if (!params.message.member.roles.has(config.staffrole)) {
            require("../commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        let reason = params.args.slice(2).join(" ");

        if (!reason) return params.message.channel.send("Bitte gebe einen Grund an! Format `" + config.prefix + "ticket close <Grund>`");

        let closeEmbed = new Discord.RichEmbed()
            .setTitle("Ein Ticket wurde geschlossen")
            .setColor(0xdf4d19)
            .addField("Teammitglied", params.message.author.toString())
            .addField("Grund", reason)
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        await params.message.channel.delete(`${params.message.channel.name} wurde geschlossen!`);
        await params.logChannel.send({ embed: closeEmbed });
    }
}