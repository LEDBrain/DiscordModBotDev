const Discord = require("discord.js");
const config = require("../../config/config");

module.exports = {
    do: async function(params) {
        let addMember = params.message.mentions.users.first() || params.message.guild.members.get(params.args[2])

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Bitte führe diesen Command in einem Ticket-Channel aus!");

        if (!params.message.member.roles.has(config.staffrole)) {
            require("../commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        let perms = {
            "SEND_MESSAGES": true,
            "VIEW_CHANNEL": true
        };

        params.message.channel.overwritePermissions(addMember, perms);

        let guild = params.message.guild;

        let linkTicket = "https://canary.discordapp.com/channels/" + guild.id + "/" + params.message.channel.id;

        let addedEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde zu einem Ticket hinzugefügt!")
            .setColor(0x53cdd8)
            .addField("User", addMember.toString())
            .addField("Teammitglied", params.message.author.toString())
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        let addedLOGEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde zu einem Ticket hinzugefügt!")
            .setColor(0x53cdd8)
            .setDescription("[Ticket](" + linkTicket + ")")
            .addField("User", addMember.toString())
            .addField("Teammitglied", params.message.author.toString())
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        await params.message.channel.send(addedEmbed);
        await params.logChannel.send(addedLOGEmbed);
    }
}