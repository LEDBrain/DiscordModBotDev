const config = require("../config/config");
const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(config.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(config.staffrole)) {
            params.message.channel.send("Du kannst keine Administratoren oder Moderatoren Warnen!");
            return;
        }

        if (!member) {
            params.message.channel.send(`Bitte gebe ein User an! Format: \`${config.prefix}mute <@user> <Grund>\``);
            return;
        }

        if (!reason) {
            params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${config.prefix}mute <@user> <Grund>\``);
            return;
        }

        db.query(`SELECT \`mutes\` FROM \`mute\` WHERE \`id\` = ?`, [member.id], function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                let mutes = 1;
                db.query(`INSERT INTO \`mute\` (\`id\`, \`username\`, \`mutes\`) VALUE (?, ?, ?)`, [member.id, member.user.username, mutes], function(error) {
                    if (error) throw (error);
                    member.addRole(config.muterole, reason);
                    params.message.channel.send(`${member} wurde gemuted`);

                    let fmuteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde das erste mal gemuted")
                        .setColor(0xe73e51)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", `\`\`\`${reason}\`\`\``)
                        .setFooter(`${config.appName} ${config.version}`)
                        .setTimestamp();

                    // Embed in den LOG schicken
                    params.logChannel.send({ embed: fmuteEmbed });
                });
            } else {
                let mutes = result[0].mutes + 1;
                db.query(`UPDATE \`mute\` SET \`mutes\` = ? WHERE \`id\` = ?`, [mutes, member.id], function(error) {
                    if (error) throw (error);
                    member.addRole(config.muterole, reason);
                    params.message.channel.send(`${member.user} wurde gemuted. Gesamte Mutes: ${mutes}`);

                    let muteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde gemuted!")
                        .setColor(0xe73e51)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", `\`\`\`${reason}\`\`\``)
                        .setFooter(`${config.appName} ${config.version}`)
                        .setTimestamp();

                    params.logChannel.send({ embed: muteEmbed });
                });
            }
            db.end();
            console.log("Disconnected");
        });
    }
};