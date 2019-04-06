module.exports = {
    do: function(params) {
        if (!params.message.member.roles.has(params.ownerID)) return params.message.channel.send("Nice try! :joy:");

        try {
            params.message.channel.send("Der Bot fährt herunter...")
                .then(() => {
                    params.client.destroy();
                });
        } catch (e) {
            params.message.channel.send(`ERROR: ${e.message}`);
        }
    }
}
