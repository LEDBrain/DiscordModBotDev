const Discord = require("discord.js");

module.exports = {
    do: function (params) {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle("Help!!")
            .setColor(0x005542)
            .addField("All commands:", `\`\`\`${params.prefix}(un-)mute, ${params.prefix}tempmute, ${params.prefix}kick, ${params.prefix}ban (WIP), ${params.prefix}warn, ${params.prefix}ticket <new/add/topic/close>\`\`\``)
            .addBlankField()
            .addField(`${params.prefix}mute`, `\`${params.prefix}(un-)mute @<user>\``)
            .addField(`${params.prefix}tempmute`, `\`${params.prefix}tempmute @<user> <Time (s/m/h/d)> <Reason>\``)
            .addField(`${params.prefix}kick`, `\`${params.prefix}kick @<user> <Reason>\``)
            .addField(`${params.prefix}ban`, `\`${params.prefix}ban @<user> <Reason>\``)
            .addField(`${params.prefix}warn`, `\`${params.prefix}warn @<user> <Reason>\``)
            .addField("Ticket Section New", `\`${params.prefix}ticket new <Ticket-Reason>\``)
            .addField("Ticket Section Add", `\`${params.prefix}ticket add @<user>\``)
            .addField("Ticket Section Topic", `\`${params.prefix}ticket topic <new Ticket-Reason>\``)
            .addField("Ticket Section Close", `\`${params.prefix}ticket close <Reason>\``)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        params.message.channel.send({
            embed: helpEmbed
        });
    }
};