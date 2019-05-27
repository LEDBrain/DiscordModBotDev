const Discord = require("discord.js");
const ms = require("ms");
const db = require("../config/db");
const mysql = require("mysql");

module.exports = {
    do: async function (params) {
        let mutetime = params.args[2];
        let reason = params.args[3];
        const member = params.message.mentions.members.first();

        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        if (member.roles.has(params.muterole)) return params.message.channel.send("This User is already muted!");

        if (member.roles.has(params.staffrole)) return params.message.channel.send("You cannot mute Staff Members!");

        if (!member) return params.message.channel.send(`Please give an User! Format: \`${params.prefix}tempmute <@user> <Reason>\``);

        if (!mutetime) return params.message.reply("Please give a mutetime!");

        if (!reason) return params.message.channel.send(`Please give a reason! Format: \`${params.prefix}tempmute <@user> <Reason>\``);


        await db.query("SELECT `mutes` FROM `mute` WHERE `id` = ?", member.id, (err, result) => {
            if (err) throw (err);
            let mutes = result[0] ? result[0].mutes + 1 : 1;
            let sql = !result[0] ? mysql.format("INSERT INTO `mute` (`id`, `username`, `mutes`) VALUE (?, ?, 1)", [member.id, member.user.username]) : mysql.format("UPDATE `mute` SET `mutes` = ? WHERE `id` = ?", [mutes, member.id]);
            db.query(sql, (err) => {
                if (err) throw (err);
                await member.addRole(params.muterole, reason);
                await params.message.channel.send(`<@${member.id}> got muted for ${ms(ms(mutetime))}`)
                let muteEmbed = new Discord.RichEmbed()
                    .setTitle(`A user got muted for the ${mutes === 1 ? "first time" : `${mutes} time`}.`)
                    .setColor(0xe73e51)
                    .addField("User", `${member.user}/${member.id}`)
                    .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                    .addField("Total mutes", mutes)
                    .addField("Reason", `\`\`\`${reason}\`\`\``)
                    .addField("Time", mutetime)
                    .setFooter(`${params.appName} ${params.version}`)
                    .setTimestamp();
                params.logChannel.send({
                    embed: muteEmbed
                })
            });
            db.end();
            console.log("Disconnected");
        });

        setTimeout(async function () {
            await member.removeRole(params.muterole, reason)
            await params.message.channel.send(`<@${member.id}> got unmuted!`);

            let tmEndeEmbed = new Discord.RichEmbed()
                .setTitle("A user got unmuted (auto)")
                .setColor(0x179e40)
                .addField("User", `${member.user}/${member.id}`)
                .addField("Moderator", `${params.message.author}/${params.message.author.id}`)
                .addField("Reason", `\`\`\`${reason}\`\`\``)
                .addField("Time", mutetime)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            params.logChannel.send({
                embed: tmEndeEmbed
            });
        }, ms(mutetime));
    }
}