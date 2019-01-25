// Discord Client erstellen
const Discord = require('discord.js');
const client = new Discord.Client();

//Erster LOG Channel schritt
let logChannel;

// Config holen
const config = require("./config/config");

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
    if (message.author.id == "268478587651358721") return;
    // Schauen ob der LOG Channel da ist
    if (logChannel) {

        // Embed generieren
        let messageDeleteE = new Discord.RichEmbed()
            .setTitle("Nachricht gelöscht!")
            .setColor(0x00AE86)
            .addField("Channel", message.channel.name + "/" + message.channel.id)
            .addField("User", message.author.tag + "/" + message.author.id)
            // .addField("Server", message.guild.name + "/" + message.guild.id)
            .addField("Nachricht", "```" + message.content + "```");

        // Nachricht senden
        logChannel.send({ embed: messageDeleteE });
    }
});

// LOG für bearbeitete Nachricht
client.on('messageUpdate', (message) => {
    if (logChannel) {

        // Nicht auf eigene Nachrichten antworten (kam vor)
        if (message.author === client.user) return;

        // LOG Channel getten
        const logChannel = client.channels.get(config.logChannel);

        // Embed generieren
        let messageUpdateE = new Discord.RichEmbed()
            .setTitle("Nachrichtenverlauf")
            .setColor(0x30add3)
            .addField("Before:", "```" + message.edits[0] + "```")
            .setFooter("Discord Log Bot " + config.version)
            .addField("Channel", message.channel.name + "/" + message.channel.id)
            // .addField("Server", message.guild.name + "/" + message.guild.id)
            .setTimestamp();

        // Nachrichten senden, zuerst oben, dann unten
        logChannel.send("Eine Nachricht wurde in " + message.channel.name + "/" + message.channel.id + " bearbeitet!")
            .then(() => logChannel.send({ embed: messageUpdateE }));
    }
});

client.on('message', (message) => {

    // Checken ob die Nachricht aus einer Guild kam
    if (!message.guild) return;

    // Warten auf ne !mute Nachricht
    if (message.content.startsWith("!mute")) {

        // Schauen ob der Message.Author die Moderator Rolle hat
        if (!message.member.roles.has("536612048377741332")) {

            // Reply für keine Berechtigungen
            message.reply("du hast leider keine Berechtigung für diesen Command")

            // LOG zum Stalken
            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", message.channel.name + "/" + message.channel.id)
                .addField("User", message.author.tag + "/" + message.author.id)
                .setFooter("Discord Log Bot " + config.version)
                .setTimestamp();

            // Ins LOG senden
            logChannel.send({ embed: nopermsEmbed });

            return

        };

        // Den User aus dem Tag bekommen
        const user = message.mentions.users.first();

        // Wenn es einen User gibt weiter machen
        if (user) {

            // Den Guild Member aus dem User bekommen
            const member = message.guild.member(user);

            // Wenn es ein Guild member ist, weiter machen
            if (member) {

                // Role hinzufügen
                member.addRole("538081337798688788");

                // Bestätigung senden
                message.channel.send(member + " wurde gemuted");

                // Embed generieren
                let muteEmbed = new Discord.RichEmbed()
                    .setTitle("Ein User wurde gemuted")
                    .setColor(0x30add3)
                    .addField("Moderator", message.author.tag + "/" + message.author.id)
                    .addField("Muted", member.tag + "/" + member.id)
                    .setFooter("Discord Log Bot " + config.version)
                    .setTimestamp();

                // Embed in den LOG schicken
                logChannel.send({ embed: muteEmbed });
            }
        }
    }

    // UNMUTE Command
    if (message.content.startsWith("!unmute")) {

        // Schauen ob der Message.Author die Moderator Rolle hat
        if (!message.member.roles.has("536612048377741332")) {

            // Reply für keine Berechtigungen
            message.reply("du hast leider keine Berechtigung für diesen Command")

            // LOG zum Stalken
            let nopermsEmbed = new Discord.RichEmbed()
                .setTitle("Ein User hat versucht einen anderen zu muten (noperm)")
                .setColor()
                .addField("Channel", message.channel.name + "/" + message.channel.id)
                .addField("User", message.author.tag + "/" + message.author.id)
                .setFooter("Discord Log Bot " + config.version)
                .setTimestamp();

            // Ins LOG senden
            logChannel.send({ embed: nopermsEmbed });

            return

        };

        // Den User aus dem Tag bekommen
        const user = message.mentions.users.first();

        // Wenn es einen User gibt weiter machen
        if (user) {

            // Den Guild Member aus dem User bekommen
            const member = message.guild.member(user);

            // Wenn es ein Guild member ist, weiter machen
            if (member) {

                // Role entfernen
                member.removeRole("538081337798688788");

                // Bestätigung senden
                message.channel.send(member + " wurde entmuted");

                // Embed generieren
                let muteEmbed = new Discord.RichEmbed()
                    .setTitle("Ein User wurde entmuted")
                    .setColor(0x30add3)
                    .addField("Moderator", message.author.tag + "/" + message.author.id)
                    .addField("Entmuted", member.tag + "/" + member.id)
                    .setFooter("Discord Log Bot " + config.version)
                    .setTimestamp();

                // Embed in den LOG schicken
                logChannel.send({ embed: muteEmbed });
            }
        }
    }
});

client.login(config.clientToken);