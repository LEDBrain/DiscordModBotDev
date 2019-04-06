const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: async function(params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (!member.roles.has(params.muterole)) return params.message.channel.send("Der User ist nicht gemuted!");

        if (member.roles.has(params.staffrole)) return params.message.channel.send("Du kannst keine Administratoren oder Moderatoren entmuten!");

        if (!member) return params.message.channel.send(`Bitte gebe ein User an! Format: \`${params.prefix}unmute <@user> <Grund>\``);

        if (!reason) return params.message.channel.send(`Bitte gebe einen Grund an! Format: \`${params.prefix}unmute <@user> <Grund>\``);

        await db.query("SELECT `mutes` FROM `mute` WHERE `id` = ?", [member.id], (err, result) => {
            if (err) throw err;
            let mutes = result[0] ? result[0].mutes : 0;
            // Role entfernen
            member.removeRole(params.muterole, "unmute")
                .then(() => {
                    // Embed generieren
                    let unmuteEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde entmuted")
                        .setColor(0x179e40)
                        .addField("User", `${member.user.username}/${member.id}`)
                        .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                        .addField("Mutes gesamt", mutes)
                        .addField("Grund", `\`\`\`${reason}\`\`\``)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    // Bestätigung senden
                    params.message.channel.send(`${member} wurde entmuted`);

                    // Embed in den LOG schicken
                    params.logChannel.send({embed: unmuteEmbed});
                });
                db.end();
                console.log("Disconnected");
        });
    }
};
