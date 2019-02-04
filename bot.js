// Discord Client erstellen
const Discord = require('discord.js');
const client = new Discord.Client();
const async = require("async");

//Erster LOG Channel schritt
let logChannel;

// Config holen
const config = require("./config/config");

// DB
const db = require("./config/db");

client.on('ready', () => {

    // LOG Channel holen (2. LOG Channel Schritt)
    logChannel = client.channels.get(config.logChannel);
    // Client Username anzeigen
    console.log("Verbunden als " + client.user.tag);

    // Client Server ausgeben
    console.log("Verbunden zu: ");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
    });

    // Activity auf "Schaut auf Nachrichten" setzen
    client.user.setActivity("auf Nachrichten", { type: "WATCHING" });
});

// LOG für eine gelöschte Nachricht
client.on('messageDelete', (message) => {
    if (message.author.id == config.drss) return;
    // Schauen ob der LOG Channel da ist
    if (logChannel) {

        let linkChannel = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id;
        // Embed generieren
        let messageDeleteE = new Discord.RichEmbed()
            .setTitle("Nachricht gelöscht!")
            .setColor(0x00AE86)
            .setDescription("Nachricht\n ```" + message.content + "```\n User\n" + message.author + "\n\n [Zum Channel]" + "(" + linkChannel + ")")
            .setFooter("Discord Log Bot " + config.version)
            .setTimestamp();

        // Nachricht senden
        logChannel.send({ embed: messageDeleteE });
    }
});

// LOG für bearbeitete Nachricht
client.on('messageUpdate', (message) => {
    if (message.channel.id === config.gitdates) return;

    if (message.edits[0] === message.content) return;

    if (logChannel) {

        if (message.author.id === config.drss) return;

        // Nicht auf eigene Nachrichten antworten (kam vor)
        if (message.author === client.user) return;

        // LOG Channel getten
        const logChannel = client.channels.get(config.logChannel);

        let linkMessage = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id;
        // Embed generieren
        let messageUpdateE = new Discord.RichEmbed()
            .setTitle("Nachricht editiert!")
            .setColor(0x30add3)
            .setDescription("Ursprüngliche Nachricht:\n ```" + message.edits[0] + "```\n" + "[Zum Beitrag]" + "(" + linkMessage + ")")
            .setFooter("Discord Log Bot " + config.version)
            .setTimestamp();

        // Nachrichten senden, zuerst oben, dann unten
        logChannel.send({ embed: messageUpdateE });
    }
});

client.on('message', (message) => {

    if (message.content === config.prefix + "help") {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle("Hilfe!!")
            .addField("Übersicht aller Commands:", "```" + config.prefix + "(un-)mute, " + config.prefix + "kick, " + config.prefix + "ban (noch in arbeit), " + config.prefix + "warn```")
            .addBlankField()
            .addField(config.prefix + "mute", "`" + config.prefix + "(un-)mute/ @<user>`")
            .addField(config.prefix + "kick", "`" + config.prefix + "kick @<user> <Grund>`")
            .addField(config.prefix + "ban", "`" + config.prefix + "ban @<user> <Grund>`")
            .addField(config.prefix + "warn", "`" + config.prefix + "warn @<user> <Grund>`")
            .setTimestamp();

        message.channel.send({ embed: helpEmbed });

    }

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    // Warten auf ne !mute Nachricht
    if (message.content.startsWith(config.prefix + "mute")) {

        // Schauen ob der Message.Author die Moderator Rolle hat
        if (!message.member.roles.has(config.modrole)) {

            // Reply für keine Berechtigungen
            message.reply(" du hast leider keine Berechtigung für diesen Command");

            // LOG zum Stalken
            let linkChannel = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id;

            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", message.author + "/" + message.author.id)
                .setFooter("Discord Log Bot " + config.version)
                .setTimestamp();

            // Ins LOG senden
            logChannel.send({ embed: nopermsEmbed });

            return;

        }

        // Den User aus dem Tag bekommen
        const user = message.mentions.users.first();

        // Wenn es einen User gibt weiter machen
        if (user) {

            // Den Guild Member aus dem User bekommen
            const member = message.guild.member(user);

            if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
                message.channel.send("Du kannst keine Administratoren oder Moderatoren muten!");
                return;
            }

            // Wenn es ein Guild member ist, weiter machen
            if (member) {

                // Role hinzufügen
                member.addRole(config.muterole);

                // Bestätigung senden
                message.channel.send(member + " wurde gemuted");

                // Embed generieren
                let muteEmbed = new Discord.RichEmbed()
                    .setTitle("Ein User wurde gemuted")
                    .setColor(0x30add3)
                    .addField("Moderator", message.author + "/" + message.author.id)
                    .addField("Muted", member.user.username + "/" + member.id)
                    .setFooter("Discord Log Bot " + config.version)
                    .setTimestamp();

                // Embed in den LOG schicken
                logChannel.send({ embed: muteEmbed });
            }
        }
    }

    // UNMUTE Command
    if (message.content.startsWith(config.prefix + "unmute")) {

        // Schauen ob der Message.Author die Moderator Rolle hat
        if (!message.member.roles.has(config.modrole)) {

            // Reply für keine Berechtigungen
            message.reply("du hast leider keine Berechtigung für diesen Command");

            // LOG zum Stalken
            let linkChannel = "https://canary.discordapp.com/channels/" + message.guild.id + "/" + message.channel.id;
            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", linkChannel)
                .addField("User", message.author + "/" + message.author.id)
                .setFooter("Discord Log Bot " + config.version)
                .setTimestamp();

            // Ins LOG senden
            logChannel.send({ embed: nopermsEmbed });

            return;

        }

        // Den User aus dem Tag bekommen
        const user = message.mentions.users.first();

        // Wenn es einen User gibt weiter machen
        if (user) {

            // Den Guild Member aus dem User bekommen
            const member = message.guild.member(user);

            if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
                message.channel.send("Du kannst keine Administratoren oder Moderatoren entmuten!");
                return;
            }

            // Wenn es ein Guild member ist, weiter machen
            if (member) {

                // Role entfernen
                member.removeRole(config.muterole);

                // Bestätigung senden
                message.channel.send(member + " wurde entmuted");

                // Embed generieren
                let muteEmbed = new Discord.RichEmbed()
                    .setTitle("Ein User wurde entmuted")
                    .setColor(0x30add3)
                    .addField("Entmuted", member.user.username + "/" + member.id)
                    .addField("Moderator", message.author + "/" + message.author.id)
                    .setFooter("Discord Log Bot " + config.version)
                    .setTimestamp();

                // Embed in den LOG schicken
                logChannel.send({ embed: muteEmbed });
            }
        }
    }

    if (message.content.startsWith(config.prefix + "kick")) {

        if (!message.member.roles.has(config.modrole)) {
            message.channel.send("Du hast leider keine Berechtigungen!");
            return;
        }

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

        let member = message.mentions.members.first();

        if (!member) {
            message.channel.send("Bitte gebe ein User an! Format: `!kick <@user> <Grund>`");
            return;
        }

        if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
            message.channel.send("Du kannst keine Administratoren oder Moderatoren kicken!");
            return;
        }

        let reason = args.slice(2).join(" ");

        if (!reason) {
            message.channel.send("Bitte gebe einen Grund an! Format: `!kick <@user> <Grund>`");
            return;
        }

        let kickEmbed = new Discord.RichEmbed()
            .setTitle("Ein Mitglied wurde gekickt")
            .setColor(0xf4eb42)
            .addField("Member", member.user + "/" + member.id, true)
            .addField("Moderator", message.author, true)
            .addBlankField()
            .addField("Grund", "```" + reason + "```", true)
            .setFooter("Discord Log Bot " + config.version)
            .setTimestamp();

        member.kick(reason)
            .then(() => logChannel.send({ embed: kickEmbed }));
    }

    if (message.content.startsWith(config.prefix + "warn")) {

        if (!message.member.roles.has(config.modrole)) {
            message.channel.send("Du hast leider keine Berechtigungen!");
            return;
        }

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

        let member = message.mentions.members.first();

        if (!member) {
            message.channel.send("Bitte gebe ein User an! Format: `!warn <@user> <Grund>`");
            return;
        }

        if (member.roles.has(config.adminrole) || member.roles.has(config.modrole)) {
            message.channel.send("Du kannst keine Administratoren oder Moderatoren Warnen!");
            return;
        }

        let reason = args.slice(2).join(" ");

        if (!reason) {
            message.channel.send("Bitte gebe einen Grund an! Format: `!warn <@user> <Grund>`");
            return;
        }

        db.query("SELECT `warns` FROM `warnungen` WHERE `id` = " + db.escape(member.id), function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                warns = 1;
                db.query("INSERT INTO `warnungen` (`id`, `username`, `warns`) VALUE (" + db.escape(member.id) + ", " + db.escape(member.user.username) + ", " + db.escape(warns) + ")", function(error) {
                    if (error) throw (error);
                    message.channel.send(member.user + " wurde zum ersten mal verwarnt");

                    let firstWarnEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde das erste Mal verwarnt!")
                        .setColor(0xf4eb42)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", message.author + "/" + message.author.id)
                        .addField("Warns", warns)
                        .addField("Grund", "```" + reason + "```")
                        .setFooter("Discord Log Bot " + config.version)
                        .setTimestamp();

                    logChannel.send({ embed: firstWarnEmbed });
                });
            } else {
                warns = result[0].warns + 1;
                db.query("UPDATE `warnungen` SET `warns` =  " + db.escape(warns) + " WHERE `id` = " + db.escape(member.id), function(error) {
                    if (error) throw (error);
                    message.channel.send(member.user + " wurde verwarnt. Jetzige Warns: " + warns);

                    let warnEmbed = new Discord.RichEmbed()
                        .setTitle("Ein User wurde verwarnt!")
                        .setColor(0xf4eb42)
                        .addField("User", member.user + "/" + member.id)
                        .addField("Moderator", message.author + "/" + message.author.id)
                        .addField("Warns", warns)
                        .addField("Grund", "```" + reason + "```")
                        .setFooter("Discord Log Bot " + config.version)
                        .setTimestamp();

                    logChannel.send({ embed: warnEmbed });
                });
            }
        });
    }

    if (message.content.startsWith(config.prefix + "seewarns")) {

        if (!message.member.roles.has(config.modrole)) {
            message.channel.send("Du hast leider keine Berechtigungen!");
            return;
        }

        let member = message.mentions.members.first();

        if (!member) {
            message.channel.send("Bitte gebe ein User an! Format: `!seewarn <@user>`");
            return;
        }

        let jw = db.query("SELECT `warns` FROM `warnungen` WHERE `id` = " + db.escape(member.id), function(err, result) {
            if (err) throw err;
            message.channel.send(member + " hat " + (result[0].warns || 0) + " verwarnungen!");
        })
    }

    if (message.content === config.prefix + "random") {
        var random = Math.random();

        if (random < "0.5") {
            message.channel.send("Kopf!");
        } else if (random > "0.5") {
            message.channel.send("Zahl!");
        }
    }
});

client.login(config.clientToken);