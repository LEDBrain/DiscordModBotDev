const config = require("../config/config");
const db = require("../config/db");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        const member = params.message.mentions.members.first();
        let reason = params.args.slice(2).join(" ");

        if (!params.message.member.roles.has(config.modrole)) {

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

        if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
            params.message.channel.send("Du kannst keine Administratoren oder Moderatoren entmuten!");
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

        // Role entfernen
        member.removeRole(config.muterole);

        // Bestätigung senden
        params.message.channel.send(member + " wurde entmuted");

        let mutes = db.query("SELECT `mutes` FROM `mute` WHERE `id` = " + db.escape(member.id))
            // Embed generieren
        let unmuteEmbed = new Discord.RichEmbed()
            .setTitle("Ein User wurde entmuted")
            .setColor(0xe73e51)
            .addField("User", member.user.username + "/" + member.id)
            .addField("Moderator", params.message.author + "/" + params.message.author.id)
            .addField("Mutes", mutes)
            .addField("Grund", "```" + reason + "```")
            .setFooter(config.appName + " " + config.version)
            .setTimestamp();

        // Embed in den LOG schicken
        params.logChannel.send({ embed: unmuteEmbed });
    }
}