const Discord = require("discord.js");
const config = require("../../config/config");

module.exports = {
    do: function (params) {
        params.message.reply(" you have no permissions to use this command!");

        let linkChannel = `https://canary.discordapp.com/channels/${params.message.guild.id}/${params.message.channel.id}`;

        let nopermsEmbed = new Discord.RichEmbed()
            .setTitle("A user has tried to execute a command without having perms!")
            .setColor()
            .addField("Channel", linkChannel)
            .addField("User", `${params.message.author}/${params.message.author.id}`)
            .setFooter(`${config.appName} ${config.version}`)
            .setTimestamp();

        params.logChannel.send({
            embed: nopermsEmbed
        });
        return;
    }
};