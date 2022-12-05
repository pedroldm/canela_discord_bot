module.exports = (client, message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(client.config.prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);

    if (cmd) {
        writeLogs(message, client.config.logs_file_path, client.config.logs_file_name)
        cmd.execute(client, message, args);
    }
};

function writeLogs(message, logs_file_path, logs_file_name) {
    const fs = require('fs');

    const file_name = logs_file_path + logs_file_name;
    if (!fs.existsSync(logs_file_path)){
        fs.mkdirSync(logs_file_path, { recursive: true });
    }
    if (!fs.existsSync(file_name)) {
        fs.closeSync(fs.openSync(file_name, 'w'));
    }

    const file = fs.readFileSync(file_name);
    const data = {"date" : new Date().toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" }),
                  "author" : message.author.username,
                  "content" : message.content}

    if (file.length == 0) {
        fs.writeFileSync(file_name, JSON.stringify([data]));
    } else {
        const json = JSON.parse(file.toString())
        json.push(data);
        fs.writeFileSync(file_name, JSON.stringify(json));
    }
}