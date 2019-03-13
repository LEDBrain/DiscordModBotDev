const config = require("../config/config");

module.exports = {
    do: async function(params) {
        if (!params.message.member.roles.has(config.staffrole)) return params.message.channel.send("Nice try! :joy:");

        try {
            await params.message.channel.send("Der Bot fährt herunter...");

            params.client.destroy();
        } catch (e) {
            params.message.channel.send(`ERROR: ${e.message}`);
        }
    }
}