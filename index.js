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

client.player.on('songAdd', (queue, song) => queue.data.channel.send(`Música ${song} adicionada à playlist.`));
client.player.on('queueEnd', (queue) => queue.data.channel.send(`Fim da playlist.`));
client.player.on('songChanged', (queue, newSong, oldSong) => queue.data.channel.send(`${newSong} está tocando.`))
client.player.on('clientDisconnect', (queue) => queue.data.channel.send(`Fui desconectado do canal de voz. Encerrando a playlist.`))

const events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
console.log(`Loading events`);
for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
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