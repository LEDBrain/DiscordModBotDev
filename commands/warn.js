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

        if (!member) return params.message.channel.send(`Please give an user! Format: \`${params.prefix}warn <@user> <Reason>\``);

        if (member.roles.has(params.staffrole)) return params.message.channel.send("You cannot warn Staff Members!");

        if (!reason) return params.message.channel.send(`Please give a reason! Format: \`${params.prefix}warn <@user> <Reason>\``);

        db.query("SELECT `warns` FROM `warnungen` WHERE `id` = ?", member.id, (err, result) => {
            if (err) throw (err);
            let warns = result[0] ? result[0].warns + 1 : 1;
            let sql = !result[0] ? mysql.format("INSERT INTO `warnungen` (`id`, `username`, `warns`) VALUE (?, ?, 1)", [member.id, member.user.username]) : mysql.format("UPDATE `warnungen` SET `warns` = ? WHERE `id` = ?", [warns, member.id]);
            db.query(sql, error => {
                if (error) throw (error);
                params.message.channel.send(`${member.user} was warned for the ${warns === 1 ? "first time" : `${warns} time`}.`);
                let warnEmbed = new Discord.RichEmbed()
                    .setTitle(`A user was warned for ${warns === 1 ? "the first time" : `${warns} time`}!`)
                    .setColor(0xf4eb42)
                    .addField("User", `${member.user}/${member.id}`)
                    .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                    .addField("Warns", warns)
                    .addField("Reason", `\`\`\`${reason}\`\`\``)
                    .setFooter(`${params.appName} ${params.version}`)
                    .setTimestamp();

                params.logChannel.send({
                    embed: warnEmbed
                });
                db.end();
                console.log("Disconnected");
            });
        });
    }
};