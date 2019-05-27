const Discord = require("discord.js");

module.exports = {
    do: async function (params) {

        if (!params.message.channel.name.startsWith("ticket-")) return params.message.channel.send("Please only execute this command in a Ticket-Channel!");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("../commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        let topic = params.args.slice(2).join(" ");

        await params.message.channel.setTopic(topic, "Ticket Topic set/changed");

        let linkChannel = `https://canary.discordapp.com/channels/${params.message.guild.id}/${params.message.channel.id}`;

        let scTopicEmbed = new Discord.RichEmbed()
            .setTitle("The ticket topic was set/changed!")
            .setColor()
            .addField("User", params.message.author.toString())
            .addField("New topic", `\`\`\`${topic}\`\`\``)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp()

        let topicEmbed = new Discord.RichEmbed()
            .setTitle("A ticket topic was set/changed!")
            .setColor()
            .setDescription(`[Ticket](${linkChannel})`)
            .addField("User", params.message.author.toString())
            .addField("New topic", `\`\`\`${topic}\`\`\``)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp()

        await params.message.channel.send({
            embed: scTopicEmbed
        });
        await params.logChannel.send({
            embed: topicEmbed
        });
    }
}