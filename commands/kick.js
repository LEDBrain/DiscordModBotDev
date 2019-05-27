// Discord importieren um RichEmbed zu benutzen
const Discord = require("discord.js");

module.exports = {
    do: function (params) {
        // Member initialisieren
        const member = params.message.mentions.members.first();

        // Grund aus der Nachricht filtern
        let reason = params.args.slice(2).join(" ");

        // Keine Staff Rolle? Schade
        if (!params.message.member.roles.has(params.staffrole)) {
            require("./commandModules/nopermEmbed").do({
                message: params.message,
                logChannel: params.logChannel
            });
        }

        // Falls kein Member angegeben wurde
        if (!member) return params.message.channel.send(`Please give an User! Format: \`${params.prefix}kick <@user> <Reason>\``);

        // Der Member ist Mitglied des Teams? Ne dann nicht
        if (member.roles.has(params.staffrole)) return params.message.channel.send("You cannot kick Staff Members!");

        // Falls kein Grund angegeben wurde
        if (!reason) return params.message.channel.send(`Please give a Reason! Format: \`${params.prefix}kick <@user> <Reason>\``);


        // Embed für den Log Channel
        let kickEmbed = new Discord.RichEmbed()
            .setTitle("A member got kicked")
            .setColor(0xf4eb42)
            .addField("Member", `${member.user.username}/${member.id}`)
            .addField("Moderator", params.message.author)
            .addField("Reason", `\`\`\`reason\`\`\``)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        // erst kicken...
        await member.kick(reason)
        // Dann in den Channel die Nachricht senden, dass gekickt wurde
        await params.message.channel.reply(`${member.user.username} got kicked off the Server.`)
        // Und jetzt ins Log mit der Embed
        params.logChannel.send({
            embed: kickEmbed
        });
    }
};