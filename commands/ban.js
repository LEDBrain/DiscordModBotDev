const config = require("../config/config");
const Discord = require("discord.js");

module.exports = {
    do: async function(params) {
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

        let banEmbed = new Discord.RichEmbed()
            .setTitle("Ban Test")
            .addField("User", member)
            .addField("Grund", "```" + reason + "```")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        await params.message.channel.send({ embed: banEmbed })
            .then(function(message) {
                message.react("✅");
                message.react("❌");
            });

        const reactions = await params.message.awaitReactions(reaction => reaction.emoji.name === "✅" || reaction.emoji.name === "❌", { time: 600000 });
        await params.message.channel.send(reactions)
    }
};
