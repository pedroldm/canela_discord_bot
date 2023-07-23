module.exports = {
    name: 'play',
    utilisation: '{prefix}play',

    async execute(client, message, args) {
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                "channel": message.channelId
            }
        });
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(err => {
            console.log(err);
            if(!client.player.getQueue(message.guild.id))
                queue.stop();
        });
        message.reply(`Música ${song.name} by ${song.author} adicionada à playlist`);
    },
};