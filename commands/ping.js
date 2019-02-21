const config = require("../config/config");
const Discord = require("discord.js");

module.exports = {
    do: function(params) {
        let ping = params.client.ping;

        if (ping <= 50) {
            return params.message.channel.send(`${params.bars_4} Ping: ${ping}`);
        } else if (ping <= 100) {
            return params.message.channel.send(`${params.bars_3} Ping: ${ping}`);
        } else if (ping <= 150) {
            return params.message.channel.send(`${params.bars_2} Ping: ${ping}`);
        }
    }
}