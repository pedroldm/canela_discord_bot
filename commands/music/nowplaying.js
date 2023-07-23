module.exports = {
    name: 'playing',
    utilisation: '{prefix}playing',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma música tocando no momento!');
        }
        message.reply(`Tocando: ${queue.nowPlaying}`);
    },
};