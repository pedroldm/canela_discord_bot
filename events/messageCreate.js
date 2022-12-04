module.exports = (client, message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(client.config.prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);

    if (cmd) {
        const fs = require('fs');
        fs.appendFile(client.config.logs_file_path + client.config.logs_file_name, new Date() + " : Author - \"" + message.author.username + "\", Channel - " + message.channel + ", Content - \"" + message.content + "\"\n", function(err){
            if(err) throw err;
            console.log(message);
        });
        cmd.execute(client, message, args);
    }
};