module.exports = {
    name: 'skip',
    utilisation: '{prefix}skip',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma música na fila para pular!');
        }
        queue.skip();
    },
};