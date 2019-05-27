const db = require("../config/db");
const Discord = require("discord.js");
const mysql = require("mysql");

module.exports = {
    do: function (params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(params.muterole)) return params.message.channel.send("This user is muted already!");

        if (member.roles.has(params.staffrole)) return params.message.channel.send("You cannot mute Staff Members!");

        if (!member) return params.message.channel.send(`Please give an User! Format: \`${params.prefix}mute <@user> <Reason>\``);

        if (!reason) return params.message.channel.send(`Please give a Reason! Format: \`${params.prefix}mute <@user> <Reason>\``);

        db.query("SELECT `mutes` FROM `mute` WHERE `id` = ?", [member.id], function (err, result) {
            if (err) throw (err);
            let mutes = result[0] ? result[0].mutes + 1 : 1;
            let sql = !result[0] ? mysql.format("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (?, ?, 1)", [member.id, member.user.username]) : mysql.format("UPDATE `mute` SET `mutes` = ? WHERE `id` = ?", [mutes, member.id]);
            db.query(sql, err => {
                if (err) throw (err);
                await member.addRole(params.muterole, reason);
                params.message.channel.send(`${member.user} was muted the ${mutes === 1 ? "first " : `${mutes} `}time!`);

                let muteEmbed = new Discord.RichEmbed()
                    .setTitle(`A user was muted the ${mutes === 1 ? "first " : `${mutes} `}time!`)
                    .setColor(0xe73e51)
                    .addField("User", `${member.user}/${member.id}`)
                    .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                    .addField("Mutes", mutes)
                    .addField("Grund", `\`\`\`${reason}\`\`\``)
                    .setFooter(`${params.appName} ${params.version}`)
                    .setTimestamp();

                params.logChannel.send({
                    embed: muteEmbed
                });
            });
            db.end();
            console.log("Disconnected");
        });
    }
};