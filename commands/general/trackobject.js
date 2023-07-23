module.exports = {
    name: 'trackobject',
    utilisation: '{prefix}trackobject',

    execute(client, message, args) {
        if (!args[0])
            return message.reply(`\`\`\`Por favor, introduza um código para rastreio.\`\`\``);
        if (!args[0].match(client.config.tracking_regex.code_format))
            return message.reply(`\`\`\`Por favor, introduza um código válido para rastreio.\`\`\``);

        let url = 'https://www.linkcorreios.com.br/?id=' + args[0];
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                return message.reply(parseHtml(client, xhr.responseText));
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    },
};

function parseHtml(html) {
    if (html.match(new RegExp(client.config.tracking_regex.tracking_avaliable, "i")))
        return ('\`\`\`❌ ERRO : Objeto não encontrado. Verifique se o código do objeto está correto.\`\`\`');
    let match = html.match(new RegExp(client.config.tracking_regex.object_info, "i"));
    if (match)
        return ('\`\`\`Status  : ' + match[1] + '\nData    : ' + match[2] + '\nHora    : ' + match[3] + '\nOrigem  : ' + match[4] + '\nDestino : ' + match[5] + '\`\`\`');
    match = html.match(new RegExp(client.config.tracking_regex.object_info_type2, "i"));
    if (match)
        return ('\`\`\`Status : ' + match[1] + '\nData   : ' + match[2] + '\nHora   : ' + match[3] + '\nLocal  : ' + match[4] + '\`\`\`');
    return ('\`\`\`Status não mapeado, favor informar o responsável\`\`\`')
}