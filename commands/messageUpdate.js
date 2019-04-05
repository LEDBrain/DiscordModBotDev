const Discord = require("discord.js");

module.exports = {
    do: function(params) {

        if (params.oldMessage.content === params.newMessage.content) return;

        if (params.newMessage.author.bot) return;

        if (params.logChannel) {

            let linkChannel = `https://canary.discordapp.com/channels/${params.newMessage.guild.id}/${params.newMessage.channel.id}`;
            // Embed generieren
            let messageUpdate = new Discord.RichEmbed()
                .setTitle("Nachricht editiert!")
                .setColor(0x30add3)
                .addField(`Ursprüngliche Nachricht:`, `\`\`\`${params.oldMessage}\`\`\``)
                .addField(`Neue Nachricht:`, `\`\`\`${params.newMessage}\`\`\``)
                .setDescription(`[Zum Beitrag](${linkChannel})`)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            // Nachricht senden
            params.logChannel.send({ embed: messageUpdate });
        }

    }
};