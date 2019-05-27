const Discord = require("discord.js");

module.exports = {
    do: async function (params) {

        if (params.message.channel.name === "ticket-test") return;

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Please only execute this command in a Ticket-Channel!");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("../commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        let reason = params.args.slice(2).join(" ");

        if (!reason) return params.message.channel.send(`Please give a reason! Format \`${params.prefix}ticket close <Reason>\``);

        let closeEmbed = new Discord.RichEmbed()
            .setTitle("A Ticket was closed")
            .setColor(0xdf4d19)
            .addField("Staff Member", params.message.author.toString())
            .addField("Reason", reason)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        await params.message.channel.delete(`${params.message.channel.name} was closed!`);
        await params.logChannel.send({
            embed: closeEmbed
        });
    }
}