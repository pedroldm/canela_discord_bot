module.exports = async (queue) => {
    let initMessage = queue.data.queueInitMessage;
    await initMessage.channel.send(`Fim da playlist.`)
};