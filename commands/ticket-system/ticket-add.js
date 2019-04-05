const Discord = require("discord.js");

module.exports = {
    do: async function(params) {

        if (params.message.channel.name === "ticket-test") return;

        let addMember = params.message.mentions.users.first();

        if (!addMember) return params.messsage.channel.send(`Bitte gebe einen User an! Format: \`${params.prefix}ticket add <@User>\``);

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Bitte führe diesen Command in einem Ticket-Channel aus!");

        if (!params.message.member.roles.has(params.staffrole)) {
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

        let linkTicket = `https://canary.discordapp.com/channels/${guild.id}/${params.message.channel.id}`;

        let addedEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde zu einem Ticket hinzugefügt!")
            .setColor(0x53cdd8)
            .addField("User", addMember.toString())
            .addField("Teammitglied", params.message.author.toString())
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        let addedLOGEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde zu einem Ticket hinzugefügt!")
            .setColor(0x53cdd8)
            .setDescription(`[Ticket](${linkTicket})`)
            .addField("User", addMember.toString())
            .addField("Teammitglied", params.message.author.toString())
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        await params.message.channel.send({embed: addedEmbed});
        await params.logChannel.send({embed: addedLOGEmbed});
    }
}