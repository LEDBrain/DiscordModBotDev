const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle("Hilfe!!")
            .setColor(0x005542)
            .addField("Übersicht aller Commands:", "```" + config.prefix + "(un-)mute, " + config.prefix + "tempmute, " + config.prefix + "kick, " + config.prefix + "ban (noch in arbeit), " + config.prefix + "warn, " + config.prefix + "ticket <new/add/topic/close>```")
            .addBlankField()
            .addField(config.prefix + "mute", "`" + config.prefix + "(un-)mute @<user>`")
            .addField(config.prefix + "tempmute", "`" + config.prefix + "tempmute @<user> <Zeit (s/m/h/d)> <Grund>`")
            .addField(config.prefix + "kick", "`" + config.prefix + "kick @ <user> <Grund>`")
            .addField(config.prefix + "ban", "`" + config.prefix + "ban @ <user> <Grund>`")
            .addField(config.prefix + "warn", "`" + config.prefix + "warn @ <user> <Grund>`")
            .addField("Ticket Section New", "`" + config.prefix + "ticket new <Ticket-Grund>`")
            .addField("Ticket Section Add", "`" + config.prefix + "ticket add @<user>`")
            .addField("Ticket Section Topic", "`" + config.prefix + "ticket topic <neues Thema>`")
            .addField("Ticket Section Close", "`" + config.prefix + "ticket close <Grund>`")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        params.message.channel.send({ embed: helpEmbed });
    }
};