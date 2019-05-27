module.exports = {
    do: function (params) {
        if (!params.message.member.roles.has(params.ownerID)) return params.message.channel.send("Nice try! :joy:");

        try {
            await params.message.channel.send("The bot is shutting down....");
            params.client.destroy();
        } catch (e) {
            console.error(e.message);
            params.message.channel.send(`ERROR: ${e.message}`);
        }
    }
}