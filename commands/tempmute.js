const Discord = require("discord.js");
const ms = require("ms");
const db = require("../config/db");
const mysql = require("mysql");

module.exports = {
    do: function(params) {
        let mutetime = params.args[2];
        let reason = params.args[3];
        const member = params.message.mentions.members.first();

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(params.staffrole)) return params.message.channel.send("Du kannst keine Administratoren oder Moderatoren muten!");

        if (!member) return params.message.channel.send(`Bitte gebe ein User an! Format: \`${params.prefix}tempmute <@user> <Grund>\``);

        if (!mutetime) return params.message.reply("Du musst eine Dauer angeben!");

        if (!reason) return params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${params.prefix}tempmute <@user> <Grund>\``);


        db.query("SELECT `mutes` FROM `mute` WHERE `id` = ?", member.id, (err, result) => {
            if (err) throw (err);
            let mutes = result[0] ? result[0].mutes + 1 : 1;
            let sql = result[0] ? mysql.format("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (?, ?, 1)", [member.id, member.user.username]) : mysql.format("UPDATE `mute` SET `mutes` = ? WHERE `id` = ?", [mutes, member.id]);
            db.query(sql, (err) => {
                if (err) throw (err);
                member.addRole(params.muterole, reason)
                    .then(() => {
                    params.message.channel.send(`<@${member.id}> wurde für ${ms(ms(mutetime))} gemuted`)
                        .then(() => {
                        let muteEmbed = new Discord.RichEmbed()
                            .setTitle(`Ein User wurde ${mutes === 1 ? "zum ersten mal " : ""}gemuted!`)
                            .setColor(0xe73e51)
                            .addField("User", `${member.user}/${member.id}`)
                            .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                            .addField("Mutes gesamt", mutes)
                            .addField("Grund", `\`\`\`${reason}\`\`\``)
                            .addField("Zeit", mutetime)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();
                        params.logChannel.send({ embed: muteEmbed })
                            .then(() => {
                                db.end();
                                console.log("Disconnected");
                            });
                        }); 
                    });
            }); 
        });

        setTimeout(async function() {
            member.removeRole(params.muterole, reason)
                .then(() => {
                    params.message.channel.send(`<@${member.id}> wurde entmuted!`);

                    let tmEndeEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde entmuted (auto)")
                        .setColor(0x179e40)
                        .addField("User", `${member.user}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Grund", `\`\`\`${reason}\`\`\``)
                        .addField("Zeit", mutetime)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    params.logChannel.send({ embed: tmEndeEmbed });
                });
        }, ms(mutetime));
    }
}
