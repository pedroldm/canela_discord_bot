module.exports = async (queue, song) => {
    let initMessage = queue.data.queueInitMessage;
    await initMessage.channel.send(`Música ${song} adicionada à playlist.`)
};