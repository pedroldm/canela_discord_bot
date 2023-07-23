module.exports = async (queue) => {
    let initMessage = queue.data.queueInitMessage;
    await initMessage.channel.send(`Fui desconectado do canal de voz. Encerrando a playlist.`) 
};