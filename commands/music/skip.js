module.exports = {
    name: 'skip',
    utilisation: '{prefix}skip',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        console.log(queue);
        if(queue == undefined){
            return message.reply('Nenhuma música na fila para pular!');
        }
        message.reply(`Skipando música ${queue.nowPlaying}`);
        queue.skip();
    },
};