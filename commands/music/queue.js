


module.exports = {
    name: 'queue',
    utilisation: '{prefix}queue',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma playlist tocando no momento!');
        }
        message.reply(queue.nowPlaying);
    },
};