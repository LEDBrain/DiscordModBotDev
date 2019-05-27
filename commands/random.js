/*eslint camelcase: "error"*/
const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
    do: async function (params) {

        let msg = await params.message.channel.send("Generating...");

        let {
            body
        } = await superagent.get("http://aws.random.cat/meow");

        if (!{
                body
            }) return params.message.channel.send("Oh sorry, there was an error getting a cat picture....Please try again!"); //lgtm [js/trivial-conditional]

        let catEmbed = new Discord.RichEmbed()
            .setTitle("Hier eine Katze...Meow!")
            .setColor(0x1f3c88)
            .setImage(body.file)
            .setFooter(`${params.appName} ${params.version}`)
            .setTimestamp();

        params.message.channel.send({
            embed: catEmbed
        });
        msg.delete();
    }
}