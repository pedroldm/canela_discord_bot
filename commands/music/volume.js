


module.exports = {
    name: 'volume',
    utilisation: '{prefix}volume',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma playlist tocando no momento!');
        }
        if(isNaN(parseInt(args[0]))) {
            return message.reply('O valor do volume deve ser numérico');
        }
        queue.setVolume(parseInt(args[0]));
    },
};