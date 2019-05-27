const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: async function (params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (!member.roles.has(params.muterole)) return params.message.channel.send("This user is not muted!");

        if (!member) return params.message.channel.send(`Please give an User! Format: \`${params.prefix}unmute <@user> <Reason>\``);

        if (!reason) return params.message.channel.send(`PLease give a reason! Format: \`${params.prefix}unmute <@user> <Reason>\``);

        await db.query("SELECT `mutes` FROM `mute` WHERE `id` = ?", [member.id], (err, result) => {
            if (err) throw err;
            let mutes = result[0] ? result[0].mutes : 0;
            await member.removeRole(params.muterole, "unmute")

            let unmuteEmbed = new Discord.RichEmbed()
                .setTitle("A User got unmuted")
                .setColor(0x179e40)
                .addField("User", `${member.user.username}/${member.id}`)
                .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                .addField("Total mutes", mutes)
                .addField("Reason", `\`\`\`${reason}\`\`\``)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            // Bestätigung senden
            params.message.channel.send(`${member} got unmuted`);

            // Embed in den LOG schicken
            params.logChannel.send({
                embed: unmuteEmbed
            });

            db.end();
            console.log("Disconnected");
        });
    }
};