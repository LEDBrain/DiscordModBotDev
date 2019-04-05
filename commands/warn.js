const db = require("../config/db");
const Discord = require("discord.js");

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

        if (!member) {
            params.message.channel.send(`Bitte gebe ein User an! Format: \`${params.prefix}warn <@user> <Grund>\``);
            return;
        }

        if (member.roles.has(config.staffrole)) {
            params.message.channel.send("Du kannst keine Administratoren oder Moderatoren Warnen!");
            return;
        }

        if (!reason) {
            params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${params.prefix}warn <@user> <Grund>\``);
            return;
        }

        db.query("SELECT `warns` FROM `warnungen` WHERE `id` = ?", [member.id], function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                let warns = 1;
                db.query("INSERT INTO `warnungen` (`id`, `username`, `warns`) VALUE (?, ?, ?)", [member.id, member.user.username, warns], function(error) {
                    if (error) throw (error);
                    params.message.channel.send(`${member.user} wurde zum ersten mal verwarnt`);

                    let firstWarnEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde das erste Mal verwarnt!")
                        .setColor(0xf4eb42)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Warns", warns)
                        .addField("Grund", `\`\`\`reason\`\`\``)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    params.logChannel.send({ embed: firstWarnEmbed });
                });
            } else {
                let warns = result[0].warns + 1;
                db.query("UPDATE `warnungen` SET `warns` = ? WHERE `id` = ?", [warns, member.id], function(error) {
                    if (error) throw (error);
                    params.message.channel.send(`${member.user} wurde verwarnt. Jetzige Warns: ${warns}`);

                    let warnEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde verwarnt!")
                        .setColor(0xf4eb42)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Warns", warns)
                        .addField("Grund", `\`\`\`reason\`\`\``)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    params.logChannel.send({ embed: warnEmbed });
                });
            }
            db.end();
            console.log("Disconnected");
        });
    }
};