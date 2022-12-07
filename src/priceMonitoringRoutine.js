class PriceMonitoringRoutine {
    constructor (pricelist_path, client, playwright, sitesRegex) {
        this.pricelist_path = pricelist_path;
        this.client = client;
        this.playwright = playwright;
        this.channel = channel;
        this.sitesRegex = sitesRegex;
        this.readPriceList();
    }

    async monitor () {
        const browser = await playwright['firefox'].launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        for(const r of this.pricelist) {
            await page.goto(r.url);
            const html = await page.content();

            for (const [key, value] of Object.entries(this.sitesRegex)) {
                if(html.match(new RegExp(key))) {
                    let price = null;
                    for (const regex of value) {
                        price = html.match(regex);
                        if (price) 
                            break;
                    }
                    if (price) {
                        if (parseFloat(price.replace(/\.\d*/g, '')) < r.current_price) {
                            // desconto detectado
                        }
                        else {
                            // preço subiu
                        }
                    }
                    else {
                        // erro de parsing
                    }
                }
            }

        }

        await browser.close();
    }

    async sendMessageAlert(channelID, message) {
        const channel = await this.client.channels.fetch(channelID);
        await channel.send(message);
    }

    writeLogs() {

    }

    readPriceList() {
        const fs = require('fs');
        if(!this.pricelist_path || !fs.existsSync(this.pricelist_path))
            throw "Path p/ lista de preços não informado ou não existe";
        const file = fs.readFileSync(this.pricelist_path);
        this.pricelist = JSON.parse(file.toString());
    }
}