const config = require("../config/config");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.users.first();
        let reason = params.args.slice(0).join(" ");

        if (!params.message.member.roles.has(config.modrole)) {

            // Reply für keine Berechtigungen
            params.message.reply(" du hast leider keine Berechtigung für diesen Command");

            // LOG zum Stalken
            let linkChannel = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id;

            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", params.message.author + "/" + params.message.author.id)
                .setFooter("Discord Log Bot " + config.version)
                .setTimestamp();

            // Ins LOG senden
            params.logChannel.send({ embed: nopermsEmbed });

            return;
        }

        if (!params.message.member.roles.has(config.modrole)) {
            params.message.channel.send("Du hast leider keine Berechtigungen!");
            return;
        }

        if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
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
            if (!result[1]) {
                mutes = 1;
                db.query("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (" + db.ecape(member.id) + ", " + db.escape(member.user.username) + ", " + db.escape(mutes) + ")", function(error) {
                    if (error) throw (error);
                    member.addRole(config.muterole);
                    params.message.channel.send(member + " wurde gemuted");

                    let muteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde gemuted")
                        .setColor(0x30add3)
                        .addField("Moderator", params.message.author + "/" + params.message.author.id)
                        .addField("Muted", member.user.username + "/" + member.id)
                        .setFooter("Discord Log Bot " + config.version)
                        .setTimestamp();

                    // Embed in den LOG schicken
                    params.logChannel.send({ embed: muteEmbed });
                });
            }
        });
    }
};