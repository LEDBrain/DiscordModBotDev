const Discord = require("discord.js");
const config = require("../config/config");

module.exports = {
    do: async function(params) {

        let message = params.message;
        let args = params.args.slice(1);

        if (message.author.id !== config.ownerID) return await message.channel.send('this command is only made for the bot owner to use');

        const clean = text => {
            if (typeof(text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        if (message.author.id === config.ownerID) {
            try {
                const code = args.join(' ');
                let evaled = eval(code);

                if (typeof evaled !== 'string') {
                    evaled = require('util').inspect(evaled);

                    message.channel.send(clean(evaled), { code: 'xl' }, split)

                }
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }
    }
}