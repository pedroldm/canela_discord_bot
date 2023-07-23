module.exports = {
    name: 'stop',
    utilisation: '{prefix}stop',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma música na fila para parar!');
        }
        queue.stop();
    },
};