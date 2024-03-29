module.exports = {
    name: 'trackprice',
    utilisation: '{prefix}trackprice',
    async execute(client, message, args) {
        if (!args[0])
            return message.reply(`\`\`\`Por favor, introduza uma URL para acompanhamento de preço.\`\`\``);
        if (!args[0].match(new RegExp(client.config.url_regex, "i")))
            return message.reply(`\`\`\`Por favor, introduza uma URL válida para acompanhamento de preço.\`\`\``);
        console.log(needsGClid(client, args[0]))
        if (needsGClid(client, args[0]))
            args[0] += client.config.gclid;

        const html = await accessSite(args[0]);
        const parse = parseHtml(client, html);
        if (parse.status) {
            if (writePriceList({ "author_name": message.author.username, "author_id": message.author.id, "channel_id": message.channelId, "url": args[0], "current_price": parseInt(parse.message) }, client.config.pricelist_path, client.config.pricelist_file)) {
                return message.reply(`Alerta de preços criado! Assim que um desconto for identificado, você será notificado. Preço atual: R$ ${parse.message}`);
            }
            else {
                return message.reply(`O alerta de preços já existe! Caso um desconto seja identificado, você será notificado. Paciência... :thinking:`);
            }
        }
        else
            return message.reply(parse.message);
    },
};

async function accessSite(url) {
    const browser = await playwright['firefox'].launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`trackPrice - Acessando URL : ${url}`);
    await page.goto(url);
    const html = await page.content();

    await browser.close();
    return html;
}

function parseHtml(html) {
    for (const [key, value] of Object.entries(client.config.stores_regex)) {
        if (html.match(new RegExp(key))) {
            for (const regex of value) {
                let price = html.match(new RegExp(regex, "i"));
                if (price)
                    return { "status": true, "message": price[1].replace(/\./g, '').replace(/\,\d+/, '') };
            }
            return { "status": false, "message": "A URL fornecida não corresponde a um anúncio ou o mapeamento do site está incorreto." };
        }
    }
    return { "status": false, "message": "O site requisitado ainda não foi mapeado... :face_with_diagonal_mouth:" };
}

function writePriceList(parseObject, pricelist_path, pricelist_file) {
    const file_name = pricelist_path + pricelist_file;
    if (!fs.existsSync(pricelist_path)) {
        fs.mkdirSync(pricelist_path, { recursive: true });
    }
    if (!fs.existsSync(file_name)) {
        fs.closeSync(fs.openSync(file_name, 'w'));
    }
    const file = fs.readFileSync(file_name);

    if (file.length == 0) {
        fs.writeFileSync(file_name, JSON.stringify([parseObject]));
    } else {
        const json = JSON.parse(file.toString())
        for (const o of json) {
            if (o.author_id == parseObject.author_id && o.url == parseObject.url)
                return false;
        }
        json.push(parseObject);
        fs.writeFileSync(file_name, JSON.stringify(json));
    }

    return true;
}

function needsGClid(url) {
    if (url.match(/\?gclid\=/i))
        return false;
    for (const regex of client.config.needs_gclid) {
        console.log(regex)
        if (url.match(regex))
            return true;
    }
    return false;
}