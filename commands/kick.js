const config = require("../config/config");
const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.members.first();

        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(config.staffrole)) {
            params.message.reply("du hast leider keine Berechtigung für diesen Command");

            let linkChannel = "https://canary.discordapp.com/channels/" + params.message.guild.id + "/" + params.message.channel.id;
            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", params.message.author + "/" + params.message.author.id)
                .setFooter(config.appName + " " + config.version)
                .setTimestamp();

            params.logChannel.send({ embed: nopermsEmbed });
            return;
        }

        if (!member) {
            params.message.channel.send("Bitte gebe ein User an! Format: `!kick <@user> <Grund>`");
            return;
        }

        if (member.roles.has(config.staffrole)) {
            params.message.channel.send("Du kannst keine Administratoren oder Moderatoren kicken!");
            return;
        }

        if (!reason) {
            params.message.channel.send("Bitte gebe einen Grund an! Format: `!kick <@user> <Grund>`");
            return;
        }

        let kickEmbed = new Discord.RichEmbed()
            .setTitle("Ein Mitglied wurde gekickt")
            .setColor(0xf4eb42)
            .addField("Member", member.user.username + "/" + member.id)
            .addField("Moderator", params.message.author)
            .addField("Grund", "```" + reason + "```")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        params.message.channel.reply(member.user.username + "wurde vom Server gekickt.");
        member.kick(reason)
            .then(() => params.logChannel.send({ embed: kickEmbed }));
    }
};