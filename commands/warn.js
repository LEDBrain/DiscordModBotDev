const db = require("../config/db");
const Discord = require("discord.js");
const mysql = require("mysql");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.members.first();

        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (!member) return params.message.channel.send(`Bitte gebe ein User an! Format: \`${params.prefix}warn <@user> <Grund>\``);

        if (member.roles.has(config.staffrole)) return params.message.channel.send("Du kannst keine Administratoren oder Moderatoren Warnen!");

        if (!reason) return params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${params.prefix}warn <@user> <Grund>\``);

        db.query("SELECT `warns` FROM `warnungen` WHERE `id` = ?", member.id, (err, result) => {
            if (err) throw (err);
            let sql;
            let warns = result[0] ? result[0].warns + 1 : 1;
            if (!result[0]) {
                sql = mysql.format("INSERT INTO `warnungen` (`id`, `username`, `warns`) VALUE (?, ?, 1)", [member.id, member.user.username]);
            } else {
                sql = mysql.format("UPDATE `warnungen` SET `warns` = ? WHERE `id` = ?", [warns, member.id]);
            }
            db.query(sql, error => {
                if (error) throw (error);
                params.message.channel.send(`${member.user} wurde ${warns === 1 ? "zum ersten mal " : ""}verwarnt. Jetzige Warns: ${warns}`);
                let warnEmbed = new Discord.RichEmbed()
                        .setTitle(`Ein User wurde ${warns === 1 ? "zum ersten mal " : ""}verwarnt!`)
                        .setColor(0xf4eb42)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Warns", warns)
                        .addField("Grund", `\`\`\`reason\`\`\``)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                params.logChannel.send({ embed: warnEmbed });
                db.end();
                console.log("Disconnected");
            });
        });
    }
};
