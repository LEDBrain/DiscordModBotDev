const config = require("../config/config");
const Discord = require("discord.js");
const ms = require("ms");
const db = require("../config/db");

module.exports = {
    do: async function(params) {
        let mutetime = params.args[2];
        let reason = params.args[3];
        const member = params.message.mentions.members.first();

        if (!params.message.member.roles.has(config.staffrole)) {

            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(config.staffrole)) return params.message.channel.send("Du kannst keine Administratoren oder Moderatoren muten!");

        if (!member) return params.message.channel.send("Bitte gebe ein User an! Format: `!tempmute <@user> <Grund>`");

        if (!mutetime) return params.message.reply("Du musst eine Dauer angeben!");

        if (!reason) return params.message.channel.send("Bitte gebe einen Grund an! Format: `!tempmute <@user> <Grund>`");


        db.query("SELECT `mutes` FROM `mute` WHERE `id` = " + db.escape(member.id), async function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                let mutes = 1;
                db.query("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (" + db.escape(member.id) + ", " + db.escape(member.user.username) + ", " + db.escape(mutes) + ")", async function(error) {
                    if (error) throw (error);
                    await member.addRole(config.muterole);
                    await params.message.channel.send(`<@${member.id}> wurde für ${ms(ms(mutetime))} gemuted`);

                    let fmuteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde das erste mal gemuted")
                        .setColor(0xe73e51)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", params.message.author + "/" + params.message.author.id)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", "```" + reason + "```")
                        .addField("Zeit", mutetime)
                        .setFooter(config.appName + " " + config.version)
                        .setTimestamp();

                    // Embed in den LOG schicken
                    await params.logChannel.send({ embed: fmuteEmbed });
                });
            } else {
                let mutes = result[0].mutes + 1;
                db.query("UPDATE `mute` SET `mutes` =  " + db.escape(mutes) + " WHERE `id` = " + db.escape(member.id), async function(error) {
                    if (error) throw (error);
                    await member.addRole(config.muterole);
                    await params.message.channel.send(`<@${member.id}> wurde für ${ms(ms(mutetime))} gemuted`);

                    let muteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde gemuted!")
                        .setColor(0xe73e51)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", params.message.author + "/" + params.message.author.id)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", "```" + reason + "```")
                        .addField("Zeit", mutetime)
                        .setFooter(config.appName + " " + config.version)
                        .setTimestamp();

                    await params.logChannel.send({ embed: muteEmbed });
                });
            }
            db.end();
            console.log("Disconnected");
        });

        setTimeout(async function() {
            await member.removeRole(config.muterole);
            params.message.channel.send(`<@${member.id}> wurde entmuted!`);

            let tmEndeEmbed = new Discord.RichEmbed()
                .setTitle("Ein User wurde entmuted (auto)")
                .setColor(0x179e40)
                .addField("User", member.user + "/" + member.id)
                .addField("Moderator", params.message.author + "/" + params.message.author.id)
                .addField("Grund", "```" + reason + "```")
                .addField("Zeit", mutetime)
                .setFooter(config.appName + " " + config.version)
                .setTimestamp();

            params.logChannel.send({ embed: tmEndeEmbed });
        }, ms(mutetime));
    }
}