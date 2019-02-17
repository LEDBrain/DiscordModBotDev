// Config holen
const config = require("../config/config");
// Discord importieren um RichEmbed zu benutzen
const Discord = require("discord.js");

module.exports = {
	do: function(params) {
		// Member initialisieren
		const member = params.message.mentions.members.first();

		// Grund aus der Nachricht filtern
		let reason = params.args.slice(2).join(" ");

		// Keine Staff Rolle? Schade
		if (!params.message.member.roles.has(config.staffrole)) {
			require("./commandModules/nopermEmbed").do({
				message: params.message,
				logChannel: params.logChannel
 			});
		}
		
		// Falls kein Member angegeben wurde
		if (!member) {
			params.message.channel.send("Bitte gebe ein User an! Format: `!kick <@user> <Grund>`");
			return;
		}
		
		// Der Member ist Mitglied des Teams? Ne dann nicht
		if (member.roles.has(config.staffrole)) {
			params.message.channel.send("Du kannst keine Administratoren oder Moderatoren kicken!");
			return;
		}
	
		// Falls kein Grund angegeben wurde
		if (!reason) {
			params.message.channel.send("Bitte gebe einen Grund an! Format: `!kick <@user> <Grund>`");
			return;
		}

		// Embed für den Log Channel
		let kickEmbed = new Discord.RichEmbed()
			.setTitle("Ein Mitglied wurde gekickt")
			.setColor(0xf4eb42)
			.addField("Member", member.user.username + "/" + member.id)
			.addField("Moderator", params.message.author)
			.addField("Grund", "```" + reason + "```")
			.setFooter(config.appName + " " + config.version)
			.setTimestamp();

		// erst kicken...
		await member.kick(reason);
		// Dann in den Channel die Nachricht senden, dass gekickt wurde
		await params.message.channel.reply(member.user.username + " wurde vom Server gekickt.");
		// Und jetzt ins Log mit der Embed
		await params.logChannel.send({ embed: kickEmbed });
	}
};