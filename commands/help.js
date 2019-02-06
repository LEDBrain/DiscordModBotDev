const discord = require("discord.js");

module.exports = {
    do: function(params) {
        let helpEmbed = new discord.RichEmbed()
            .setTitle("Hilfe!!")
            .addField("Übersicht aller Commands:", "```" + params.prefix + "(un-)mute, " + params.prefix + "kick, " + params.prefix + "ban (noch in arbeit), " + params.prefix + "warn```")
            .addBlankField()
            .addField(params.prefix + "mute", "`" + params.prefix + "(un-)mute/ @<user>`")
            .addField(params.prefix + "kick", "`" + params.prefix + "kick @<user> <Grund>`")
            .addField(params.prefix + "ban", "`" + params.prefix + "ban @<user> <Grund>`")
            .addField(params.prefix + "warn", "`" + params.prefix + "warn @<user> <Grund>`")
            .setTimestamp();

        params.message.channel.send({ embed: helpEmbed });
    }
};