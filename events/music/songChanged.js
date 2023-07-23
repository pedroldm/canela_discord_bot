module.exports = async (queue, newSong, oldSong) => {
    let initMessage = queue.data.queueInitMessage;
    await initMessage.channel.send(`${newSong} está tocando.`)
};