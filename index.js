const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config.json');
const { readdirSync } = require('fs');

global.client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
});
client.config = require('./config.json');
client.commands = new Collection();

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));
console.log(`Loading events`);
for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
};

console.log(`Loading commands`);
readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
    };
});

console.log('Ready!');
client.login(config.bot_token);