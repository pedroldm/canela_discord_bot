module.exports = {
    name: 'play',
    utilisation: '{prefix}play',

    async execute(client, message, args) {
        console.log(args)
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(err => {
            console.log(err);
            if(!client.player.getQueue(message.guild.id))
                queue.stop();
        });
    },
};