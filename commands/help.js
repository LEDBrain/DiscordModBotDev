const config = require("../config/config");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle("Hilfe!!")
            .setColor(0x005542)
            .addField("Übersicht aller Commands:", "```" + config.prefix + "(un-)mute, " + config.prefix + "kick, " + config.prefix + "ban (noch in arbeit), " + config.prefix + "warn```")
            .addBlankField()
            .addField(config.prefix + "mute", "`" + config.prefix + "(un-)mute/ @<user>`")
            .addField(config.prefix + "kick", "`" + config.prefix + "kick @<user> <Grund>`")
            .addField(config.prefix + "ban", "`" + config.prefix + "ban @<user> <Grund>`")
            .addField(config.prefix + "warn", "`" + config.prefix + "warn @<user> <Grund>`")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        params.message.channel.send({ embed: helpEmbed });
    }
};