const Discord = require("discord.js");

module.exports = {
    do: async function (params) {

        if (params.message.channel.name === "ticket-test") return;

        let addMember = params.message.mentions.users.first();

        if (!addMember) return params.messsage.channel.send(`Please give an User! Format: \`${params.prefix}ticket add <@User>\``);

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Please only execute this command in a Ticket-Channel!");

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
            .setTitle("A user was added to a Ticket-Channel!")
            .setColor(0x53cdd8)
            .addField("User", addMember.toString())
            .addField("Staff Member", params.message.author.toString())
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        let addedLOGEmbed = new Discord.RichEmbed()
            .setTitle("A user was added to a Ticket-Channel!")
            .setColor(0x53cdd8)
            .setDescription(`[Ticket](${linkTicket})`)
            .addField("User", addMember.toString())
            .addField("Member", params.message.author.toString())
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        await params.message.channel.send({
            embed: addedEmbed
        });
        await params.logChannel.send({
            embed: addedLOGEmbed
        });
    }
}