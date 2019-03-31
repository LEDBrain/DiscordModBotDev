const config = require("../config/config");
const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: async function(params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(config.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(config.staffrole)) return params.message.channel.send("Du kannst keine Administratoren oder Moderatoren entmuten!");

        if (!member) return params.message.channel.send(`Bitte gebe ein User an! Format: \`${config.prefix}unmute <@user> <Grund>\``);

        if (!reason) return params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${config.prefix}unmute <@user> <Grund>\``);

        // Role entfernen
        await member.removeRole(config.muterole, "unmute");

        // Bestätigung senden
        await params.message.channel.send(`${member} wurde entmuted`);

        let mutes = db.query(`SELECT \`mutes\` FROM \`mute\` WHERE \`id\` = ?`, [member.id], function(err) {
            if (err) throw err;
            db.end();
            console.log("Disconnected");
        });
        // Embed generieren
        let unmuteEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde entmuted")
            .setColor(0x179e40)
            .addField("User", `${member.user.username}/${member.id}`)
            .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
            .addField("Mutes gesamt", mutes)
            .addField("Grund", `\`\`\`${reason}\`\`\``)
            .setFooter(`${config.appName} ${config.version}`)
            .setTimestamp();

        // Embed in den LOG schicken
        await params.logChannel.send({ embed: unmuteEmbed });
    }
};