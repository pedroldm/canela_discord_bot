class PriceMonitoringRoutine {
    constructor() {
        this.logs = {
            "monitoring_start": null,
            "total": null,
            "accessed": 0,
            "urls": [],
            "monitoring_end": null
        };
        this.pricelist = null;
    }
    async monitor() {
        if (!this.readPriceList())
            return;

        this.logs.monitoring_start = new Date().toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" });
        this.logs.total = this.pricelist.length;
        this.logs.accessed = 0;
        this.logs.urls = [];

        const browser = await playwright['firefox'].launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        for (let r of this.pricelist) {
            console.log(`priceMonitoringRoutine - Acessando URL : ${r.url}`);
            this.logs.urls.push(r.url);

            let maxTentativas = 5;
            let tentativas = 0;
            let html = null;
            while (tentativas++ < maxTentativas) {
                try {
                    await page.goto(r.url);
                    html = await page.content();
                    break;
                } catch (error) {
                    if (error instanceof playwright.errors.TimeoutError)
                        continue;
                }
            }

            for (const [key, value] of Object.entries(client.config.stores_regex)) {
                if (html.match(new RegExp(key))) {
                    let price = null;
                    for (const regex of value) {
                        price = html.match(regex);
                        if (price)
                            break;
                    }
                    if (price) {
                        price = parseInt(price[1].replace(/\./g, ''));
                        if (r.current_price > price) {
                            this.sendAlertMessage(r.channel_id, `<@${r.author_id}> - Seu produto ${r.url} abaixou de preço :partying_face: ! De R$${r.current_price} por ${price} !`);
                            r.current_price = price;
                        }
                        else if (r.current_price < price) {
                            this.sendAlertMessage(r.channel_id, `<@${r.author_id}> - Seu produto ${r.url} subiu de preço :neutral_face: ! De R$${r.current_price} para ${price} .`);
                            r.current_price = price;
                        }
                    }
                    else {
                        this.sendAlertMessage(r.channel_id, `<@${r.author_id}> - Ocorreu um erro ao consultar ${r.url}. Alô <@208810365839081473> :angry: .`);
                    }
                }
            }
            await new Promise(r => setTimeout(r, 15000));
        }

        this.logs.accessed = this.logs.urls.length;
        this.logs.monitoring_end = new Date().toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" });
        this.writeLogs(client);
        this.updatePriceList(client.config.pricelist_path + client.config.pricelist_file);
        await browser.close();
    }

    async sendAlertMessage(channel_id, message) {
        const channel = await client.channels.fetch(channel_id);
        await channel.send(message);
    }

    updatePriceList(file_name) {
        fs.writeFileSync(file_name, JSON.stringify(this.pricelist));
    }

    writeLogs() {
        const file_name = client.config.logs_file_path + client.config.logs_file_name;
        if (!fs.existsSync(client.config.logs_file_path)) {
            fs.mkdirSync(client.config.logs_file_path, { recursive: true });
        }
        if (!fs.existsSync(file_name)) {
            fs.closeSync(fs.openSync(file_name, 'w'));
        }

        const file = fs.readFileSync(file_name);

        if (file.length == 0) {
            fs.writeFileSync(file_name, JSON.stringify([this.logs]));
        } else {
            const json = JSON.parse(file.toString())
            json.push(this.logs);
            fs.writeFileSync(file_name, JSON.stringify(json));
        }
    }

    readPriceList() {
        const pricelist_path = client.config.pricelist_path + client.config.pricelist_file;
        if (!pricelist_path || !fs.existsSync(pricelist_path))
            return false;
        const file = fs.readFileSync(pricelist_path);
        this.pricelist = JSON.parse(file.toString());
        return true;
    }
}

module.exports = PriceMonitoringRoutine;