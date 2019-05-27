const Discord = require("discord.js");

module.exports = {
    do: function (params) {

        if (params.message.author.bot) return;

        if (params.logChannel) {

            let linkChannel = `https://canary.discordapp.com/channels/${params.message.guild.id}/${params.message.channel.id}`;
            // Embed generieren
            let messageDelete = new Discord.RichEmbed()
                .setTitle("A message was deleted!")
                .setColor(0x00AE86)
                .setDescription(`Message\n \`\`\` ${params.message.content} \`\`\`\n User\n ${params.message.author} \n\n [Link to channel](${linkChannel})`)
                .setFooter(`${params.appName} ${params.version}`)
                .setTimestamp();

            // Nachricht senden
            params.logChannel.send({
                embed: messageDelete
            });
        }

    }
};