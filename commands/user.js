// für RichEmbed's
const Discord = require("discord.js");
// Wir wollen ja auch was machen ne
const db = require("../config/db");

module.exports = {
    do: function(params) {

        // Member aus der Nachricht klauen
        let member = message.mentions.members.first();

        // Kein Teammember? Oh sorry
        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        // Falls kein Member angegeben wurde
        if (!member) return params.message.channel.send(`Bitte gebe einen User an! Format: \`${params.prefix} user <@user>\``);

        // Mutes des Users aus der DB holen
        db.query("SELECT `mutes`, `warns` FROM `mute`, `warnungen` WHERE `mute`.`id` = ? AND `warnungen`.`id` = `mute`.`id`", member.id, (err, result) => {
            if (err) throw err;
            // Nachricht fürs Log vorbereiten
            let userEmbed = new Discord.RichEmbed()
                .setTitle(`Userinfo für ${member.user.username}`)
                .setColor(0x1fab89)
                .addField("Mutes", `\`\`\`${result[0].mutes || 0}\`\`\``)
                .addField("Warns", `\`\`\`${result[0].warns || 0}\`\`\``)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            // Senden
            params.message.channel.send({ embed: userEmbed });
            // DB Connection beenden weil es zu abstürzen aufgrund von MySQL ERR gab
            db.end();
            console.log("Disconnected");
        });
    }
};
