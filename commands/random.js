const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
    do: async function(params) {

        let msg = await params.message.channel.send("Generiere...");

        let { body } = await superagent.get("http://aws.random.cat/meow");

        if (!{ body }) return params.message.channel.send("Ups...es ist etwas daneben getropft"); //lgtm [js/trivial-conditional]

        let catEmbed = new Discord.RichEmbed()
            .setTitle("Hier eine Katze...Meow!")
            .setColor(0x1f3c88)
            .setImage(body.file)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        params.message.channel.send({ embed: catEmbed })
        msg.delete()
    }
}