module.exports = {
    name: 'rastreio',
    utilisation: '{prefix}rastreio',
    execute(client, message, args) {
        if(!args[0])
            return message.reply(`\`\`\`Por favor, introduza um código para rastreio.\`\`\``);
        if(!args[0].match(/[A-Z]{2}[0-9]{9}[A-Z]{2}/))
            return message.reply(`\`\`\`Por favor, introduza um código válido para rastreio.\`\`\``);

        global.XMLHttpRequest = require('xhr2');
        let url = 'https://www.linkcorreios.com.br/?id=' + args[0];
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                return message.reply(getMatch(xhr.responseText));
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    },
};

function getMatch(string){
    let regexp = /O\s*rastreamento\s*n[^\s]{1,8}o\s*est[^\s]{1,8}\s*dispon[^\s]{1,8}vel\s*no\s*momento/;
    let match = string.match(regexp);
        if (match)
            return('\`\`\`❌ ERRO : Objeto não encontrado. Verifique se o código do objeto está correto.\`\`\`');
    regexp = /border-bottom:\s*0;"\s*style="">\s*<li>\s*Status:\s*<b>([^<]*)\s*<\/b><\/li>\s*<li>Data\s*:\s*([^\s]*)\s*\|\s*Hora\s*:\s*([^<]*)\s*<\/li>\s*<li>\s*Origem:\s*([^<]*)\s*<\/li>\s*\s*<li>\s*Destino\s*:\s*([^<]*)/;
    match = string.match(regexp);
        if (match)
            return('\`\`\`Status  : ' + match[1] + '\nData    : ' + match[2] + '\nHora    : ' + match[3] + '\nOrigem  : ' + match[4] + '\nDestino : ' + match[5] + '\`\`\`');
    regexp = /border-bottom:\s*0;"\s*style="">\s*<li>\s*Status:\s*<b>([^<]*)[^:]*:\s*([^\s]*)[^:]*:\s*([^<]*)[^:]*:\s*([^<]*)/;
    match = string.match(regexp);
        if (match)
            return('\`\`\`Status : ' + match[1] + '\nData   : ' + match[2] + '\nHora   : ' + match[3] + '\nLocal  : ' + match[4] + '\`\`\`');
    return('\`\`\`Status não mapeado, favor informar o responsável\`\`\`')
}