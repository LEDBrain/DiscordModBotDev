const config = require("../config/config");
const Discord = require("discord.js");
const db = require("../config/db");

module.exports = {
    do: function(params) {
        let member = message.mentions.members.first();

        if (!params.message.member.roles.has(config.modrole)) {
            params.message.reply("du hast leider keine Berechtigung für diesen Command");

            let linkChannel = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id;
            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", params.message.author + "/" + params.message.author.id)
                .setFooter(config.appName + " " + config.version)
                .setTimestamp();

            params.logChannel.send({ embed: nopermsEmbed });
            return;
        }

        if (!member) {
            params.message.channel.send("Bitte gebe ein User an! Format: `!seewarn <@user>`");
            return;
        }

        db.query("SELECT `warns` FROM `warnungen` WHERE `id` = " + db.escape(member.id), function(err, result) {
            if (err) throw err;
            params.message.channel.send(member + " hat " + (result[0].warns || 0) + " verwarnungen!");
        });
        db.end()
    }
};