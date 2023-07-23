


module.exports = {
    name: 'queue',
    utilisation: '{prefix}queue',

    async execute(client, message, args) {
        let queue = client.player.getQueue(message.guild.id);
        if(queue == undefined || queue.songs.length == 0){
            return message.reply('Nenhuma playlist tocando no momento!');
        }
        let playlist = '';
        for(let i = 0 ; i < queue.songs.length ; i++) {
            playlist += `${i + 1}. ${queue.songs[i].name} - ${queue.songs[i].duration} (${queue.songs[i].data.author})\n`;
        }
        message.reply(`\`\`\`${playlist}\`\`\``);
    },
};