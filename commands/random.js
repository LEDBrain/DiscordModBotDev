const config = require("../config/config");
const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
	do: function(params) {
		
		let genmsg = await message.channel.send("Generiere...");
		
		let {body} = await superagent.get("http://aws.random.cat/meow");
		
		if(!{body}) return params.message.channel.send("Ups...es ist etwas daneben getropft");
		
		let catEmbed = new Discord.RichEmbed()
			.setTitle("Hier eine Katze...Meow!")
			.setColor()
			.setImage(body.file)
			.setFooter(config.appName + " " + config.version)
			.setTimestamp();
			
		params.message.channel.send({ embed: catEmbed })
	}
}