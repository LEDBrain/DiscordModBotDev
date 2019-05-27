const Discord = require("discord.js");
const db = require("../config/db");

module.exports = {
    do: function (params) {

        let member = params.message.mentions.members.first();

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (!member) return params.message.channel.send(`Please give an user! Format: \`${params.prefix}user <@user>\``);

        db.query("SELECT `mutes`, `warns` FROM `mute`, `warnungen` WHERE `mute`.`id` = ? AND `warnungen`.`id` = `mute`.`id`", [member.id], (err, result) => {
            if (err) throw err;
            let userEmbed = new Discord.RichEmbed()
                .setTitle(`Userinfo for ${member.user.username}`)
                .setColor(0x1fab89)
                .addField("Mutes", `\`\`\`${result[0].mutes || 0}\`\`\``)
                .addField("Warns", `\`\`\`${result[0].warns || 0}\`\`\``)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            params.message.channel.send({
                embed: userEmbed
            });
            db.end();
            console.log("Disconnected");
        });
    }
};