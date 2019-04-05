const Discord = require("discord.js");
const db = require("../../config/db");

module.exports = {
    do: async function(params) {
        let subject = params.args.slice(2).join(" ");

        const guild = params.message.guild;

        let perms = {
            "SEND_MESSAGES": true,
            "VIEW_CHANNEL": true
        };

        if (!subject) return params.message.channel.send(`Bitte gebe ein Thema an! Format \`${params.prefix}ticket new <Thema/Grund>\``);

        let ticketCat = guild.channels.find(c => c.name === "Tickets")

        if (!ticketCat) {
            await guild.createChannel("Tickets", "category", [{
                id: guild.id,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
            }]);
        }

        db.query("SELECT `tNumber` FROM `tickets` WHERE `guildID` = ?", [guild.id], async function(err, result) {
            if (err) throw (err);
            if (!result[0]) {
                let ticketNumber = 1;
                db.query("INSERT INTO `tickets` (`guildID`, `tNumber`) VALUE (?, ?)", [guild.id, ticketNumber], async function(err) {
                    if (err) throw (err);

                    let createdChannel = await guild.createChannel(`ticket-00${ticketNumber}`, "text", [{
                        id: guild.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }]);

                    createdChannel.overwritePermissions(params.staffrole, perms);

                    createdChannel.overwritePermissions(params.message.author, perms);

                    createdChannel.setParent(ticketCat, "Ticket created");


                    let ticketEmbed = new Discord.RichEmbed()
                        .setTitle(`Ticket ${ticketNum}`)
                        .setColor(0xa7d129)
                        .setDescription(`Hallo ${params.message.author.toString()},\n\ndanke dass du ein Ticket erstellt hast.\n\nDas Team wurde verständigt.\n\nBitte nutze die Zeit bis ein Teammitglied da ist, um dein Problem ausführlich zu beschreiben.`)
                        .addField("Thema", subject)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    await createdChannel.send({ embed: ticketEmbed });

                    let linkChannel = `https://canary.discordapp.com/channels/${guild.id}/${createdChannel.id}`;

                    let ticketLog = new Discord.RichEmbed()
                        .setTitle(`params.message.author.toString() hat ein Ticket erstellt.`)
                        .setColor(0xcf3030)
                        .addField("User", params.message.author.toString())
                        .setDescription(`[Channel](${linkChannel})`)
                        .setFooter(`${params.appName} ${params.version}`)
                        .setTimestamp();

                    params.logChannel.send({ embed: ticketLog });
                });
            } else {
                let newTNum = result[0].tNumber + 1;

                db.query("UPDATE `tickets` SET `tNumber` = ?  WHERE `guildID` = ?", [newTNum, guild.id], async function(err) {

                    if (err) throw err;

                    if (newTNum < 10) {
                        params.message.channel.startTyping();
                        let ticketNum = `00${newTNum}`;

                        let createdChannel = await guild.createChannel(`ticket-${ticketNum}`, "text", [{
                            id: guild.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        }]);

                        createdChannel.overwritePermissions(params.staffrole, perms);

                        createdChannel.overwritePermissions(params.message.author, perms);

                        createdChannel.setParent(ticketCat, "Ticket created");

                        let ticketEmbed = new Discord.RichEmbed()
                            .setTitle(`Ticket ${ticketNum}`)
                            .setColor(0xa7d129)
                            .setDescription(`Hallo ${params.message.author.toString()},\n\ndanke dass du ein Ticket erstellt hast.\n\nDas Team wurde verständigt.\n\nBitte nutze die Zeit bis ein Teammitglied da ist, um dein Problem ausführlich zu beschreiben.`)
                            .addField("Thema", subject)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        await createdChannel.send({ embed: ticketEmbed });

                        let linkChannel = `https://canary.discordapp.com/channels/${guild.id}/${createdChannel.id}`;

                        let ticketLog = new Discord.RichEmbed()
                            .setTitle(`${params.message.author.toString()} hat ein Ticket erstellt.`)
                            .setColor(0xcf3030)
                            .addField("User", params.message.author.toString())
                            .setDescription(`[Channel](${linkChannel})`)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        params.logChannel.send({ embed: ticketLog });

                    } else if (newTNum > 9 && newTNum < 100) {

                        let ticketNum = `0${newTNum}`;

                        let createdChannel = await guild.createChannel(`ticket-${ticketNum}`, "text", [{
                            id: guild.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        }]);

                        createdChannel.overwritePermissions(params.staffrole, perms);

                        createdChannel.overwritePermissions(params.message.author, perms);

                        createdChannel.setParent(ticketCat, "Ticket created");

                        let ticketEmbed = new Discord.RichEmbed()
                            .setTitle(`Ticket ${ticketNum}`)
                            .setColor(0xa7d129)
                            .setDescription(`Hallo ${params.message.author.toString()},\n\ndanke dass du ein Ticket erstellt hast.\n\nDas Team wurde verständigt.\n\nBitte nutze die Zeit bis ein Teammitglied da ist, um dein Problem ausführlich zu beschreiben.`)
                            .addField("Thema", subject)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        await createdChannel.send({ embed: ticketEmbed });

                        let linkChannel = `https://canary.discordapp.com/channels/${guild.id}/${createdChannel.id}`;

                        let ticketLog = new Discord.RichEmbed()
                            .setTitle(`${params.message.author.username} hat ein Ticket erstellt.`)
                            .setColor(0xcf3030)
                            .addField("User", params.message.author.toString())
                            .setDescription(`[Channel](${linkChannel})`)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        params.logChannel.send({ embed: ticketLog });

                    } else if (newTNum > 99) {

                        let ticketNum = newTNum;

                        let createdChannel = await guild.createChannel(`ticket-${ticketNum}`, "text", [{
                            id: guild.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        }]);

                        createdChannel.overwritePermissions(params.staffrole, perms);

                        createdChannel.overwritePermissions(params.message.author, perms);

                        createdChannel.setParent(ticketCat, "Ticket created");


                        let ticketEmbed = new Discord.RichEmbed()
                            .setTitle(`Ticket ${ticketNum}`)
                            .setColor(0xa7d129)
                            .setDescription(`Hallo ${params.message.author.toString()},\n\ndanke dass du ein Ticket erstellt hast.\n\nDas Team wurde verständigt.\n\nBitte nutze die Zeit bis ein Teammitglied da ist, um dein Problem ausführlich zu beschreiben.`)
                            .addField("Thema", subject)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        await createdChannel.send({ embed: ticketEmbed });

                        let linkChannel = `https://canary.discordapp.com/channels/${guild.id}/${createdChannel.id}`;

                        let ticketLog = new Discord.RichEmbed()
                            .setTitle(`${params.message.author.username} hat ein Ticket erstellt.`)
                            .setColor(0xcf3030)
                            .addField("User", params.message.author.toString())
                            .setDescription(`[Channel](${linkChannel})`)
                            .setFooter(`${params.appName} ${params.version}`)
                            .setTimestamp();

                        params.logChannel.send({ embed: ticketLog });
                    }
                });
            }
            db.end();
            console.log("Disconnected");
        });
    }
}