const Discord = require("discord.js");
const config = require("../config/config");

module.exports = {
    do: function(params) {

        let member = params.member;

        let joinEmbed = new Discord.RichEmbed()
            .setTitle("Ein Jemand ist geleaved...")
            .setColor(0xea7362)
            .addField("Member", member.toString())
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        params.logChannel.send({ embed: joinEmbed })
    }
}