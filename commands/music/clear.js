module.exports = {
    name: 'clear',
    utilisation: '{prefix}clear',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma playlist para limpar!');
        }
        queue.clearQueue();
    },
};