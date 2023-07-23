module.exports = async (queue) => {
    let initMessage = queue.data.queueInitMessage;
    await initMessage.channel.send(`Todos deixaram o canal de voz, a fila foi terminada.`) 
};