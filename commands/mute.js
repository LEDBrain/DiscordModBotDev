const config = require("../config/config");
const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(config.staffrole)) {

            // Reply für keine Berechtigungen
            params.message.reply(" du hast leider keine Berechtigung für diesen Command");

            // LOG zum Stalken
            let linkChannel = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id;

            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", params.message.author + "/" + params.message.author.id)
                .setFooter(config.appName + " " + config.version)
                .setTimestamp();

            // Ins LOG senden
            params.logChannel.send({ embed: nopermsEmbed });

            return;
        }

        if (member.roles.has(config.staffrole)) {
            params.message.channel.send("Du kannst keine Administratoren oder Moderatoren Warnen!");
            return;
        }

        if (!member) {
            params.message.channel.send("Bitte gebe ein User an! Format: `!mute <@user> <Grund>`");
            return;
        }

        if (!reason) {
            params.message.channel.send("Bitte gebe einen Grund an! Format: `!mute <@user> <Grund>`");
            return;
        }

        db.query("SELECT `mutes` FROM `mute` WHERE `id` = " + db.escape(member.id), function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                let mutes = 1;
                db.query("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (" + db.escape(member.id) + ", " + db.escape(member.user.username) + ", " + db.escape(mutes) + ")", function(error) {
                    if (error) throw (error);
                    member.addRole(config.muterole);
                    params.message.channel.send(member + " wurde gemuted");

                    let fmuteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde das erste mal gemuted")
                        .setColor(0xe73e51)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", params.message.author + "/" + params.message.author.id)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", "```" + reason + "```")
                        .setFooter(config.appName + " " + config.version)
                        .setTimestamp();

                    // Embed in den LOG schicken
                    params.logChannel.send({ embed: fmuteEmbed });
                });
            } else {
                let mutes = result[0].mutes + 1;
                db.query("UPDATE `mute` SET `mutes` =  " + db.escape(mutes) + " WHERE `id` = " + db.escape(member.id), function(error) {
                    if (error) throw (error);
                    params.message.channel.send(member.user + " wurde gemuted. Gesamte Mutes: " + mutes);

                    let muteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde gemuted!")
                        .setColor(0xe73e51)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", params.message.author + "/" + params.message.author.id)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", "```" + reason + "```")
                        .setFooter(config.appName + " " + config.version)
                        .setTimestamp();

                    params.logChannel.send({ embed: muteEmbed });
                });
            }
            db.end();
            console.log("Disconnected");
        });
    }
};