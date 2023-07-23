const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require("discord-music-player");
global.fs = require('fs');
global.XMLHttpRequest = require('xhr2');
global.priceMonitoringRoutine = require('./src/priceMonitoringRoutine');
global.playwright = require('playwright');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    disableMentions: 'everyone',
});
client.config = require('./config.json');
client.commands = new Collection();

client.player = new Player(client, {
    leaveOnEmpty: true
})

client.player.on('connectionCreate', (queue) => {
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');

        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }

        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});

const generalEvents = fs.readdirSync('./events/general/').filter(file => file.endsWith('.js'));
console.log(`Loading general events`);
for (const file of generalEvents) {
    const event = require(`./events/general/${file}`);
    console.log(`-> Loaded general event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/general/${file}`)];
};

const musicEvents = fs.readdirSync('./events/music/').filter(file => file.endsWith('.js'));
console.log(`Loading music events`);
for (const file of musicEvents) {
    const event = require(`./events/music/${file}`);
    console.log(`-> Loaded music event ${file.split('.')[0]}`);
    client.player.on(file.split('.')[0], event.bind(client.player));
    delete require.cache[require.resolve(`./events/music/${file}`)];
};

console.log(`Loading commands`);
fs.readdirSync('./commands/').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
    };
});

priceMonitoring = new priceMonitoringRoutine();
priceMonitoring.monitor();
setInterval(() => {
    priceMonitoring.monitor();
}, 7200000);

console.log('Ready!');
client.login(client.config.bot_token);