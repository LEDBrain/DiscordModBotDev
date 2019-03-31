// Config holen
const config = require("../config/config");
// für RichEmbed's
const Discord = require("discord.js");
// Wir wollen ja auch was machen ne
const db = require("../config/db");

module.exports = {
    do: async function(params) {

        // Member aus der Nachricht klauen
        let member = message.mentions.members.first();

        // Kein Teammember? Oh sorry
        if (!params.message.member.roles.has(config.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        // Falls kein Member angegeben wurde
        if (!member) {
            params.message.channel.send(`Bitte gebe ein User an! Format: \`${config.prefix} user <@user>\``);
            return;
        }

        // Warns des Users aus der DB holen
        let warns = db.query(`SELECT \`warns\` FROM \`warnungen\` WHERE \`id\` = ?`, [member.id], function(err, result) { // lgtm[js/unused-local-variable]
            if (err) throw err;
        });

        // Mutes des Users aus der DB holen
        let mutes = db.query(`SELECT \`mutes\` FROM \`mute\` WHERE \`id\` = ?`, [member.id], function(err, result) { // lgtm[js/unused-local-variable]
            if (err) throw err;
            // DB Connection beenden weil es zu abstürzen aufgrund von MySQL ERR gab
            db.end();
            console.log("Disconnected");
        });

        // Nachricht fürs Log vorbereiten
        let userEmbed = new Discord.RichEmbed()
            .setTitle(`Userinfo für ${member.user.username}`)
            .setColor(0x1fab89)
            .addField("Mutes", `\`\`\`${result[0].mutes||0}\`\`\``)
            .addField("Warns", `\`\`\`${result[0].warns||0}\`\`\``)
            .setFooter(`${config.appName} ${config.version}`)
            .setTimestamp()

        // Senden
        await params.message.channel.send({ embed: userEmbed });
    }
};