const Discord = require("discord.js");

module.exports = {
    do: function (params) {

        let member = params.member;

        let leaveEmbed = new Discord.RichEmbed()
            .setTitle("Someone leaved us...")
            .setColor(0xea7362)
            .addField("Member", member.toString())
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        params.logChannel.send({
            embed: leaveEmbed
        });
    }
}