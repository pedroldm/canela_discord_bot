


module.exports = {
    name: 'progress',
    utilisation: '{prefix}progress',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined){
            return message.reply('Nenhuma música tocando no momento!');
        }
        const ProgressBar = queue.createProgressBar();
        message.reply(ProgressBar.prettier);
    },
};