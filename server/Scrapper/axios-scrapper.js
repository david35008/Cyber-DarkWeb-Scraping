const cheerio = require("cheerio");
const axios = require("axios");
const SocksAgent = require("axios-socks5-agent");
const { Data } = require("../models");
switch (process.env.ENVIRONMENT) {
    case 'development':
        IP_ADDRESS = '127.0.0.1';
        break;
    case 'docker':
        IP_ADDRESS = '172.22.0.11';
        break;
    default:
        break;
}

const { httpAgent, httpsAgent } = new SocksAgent({
    agentOptions: {
        keepAlive: true,
    },
    host: IP_ADDRESS
});

module.exports = async function axiosScrapper() {
    console.log('Scrapper Searched For New Information');
    try {
        const { data: content } = await axios.get(
            "http://nzxj65x32vh2fkhk.onion/all",
            {
                httpAgent,
                httpsAgent,
            }
        );
        const $ = cheerio.load(content);
        const titles = [];
        $("h4").each((idx, elem) => {
            const title = $(elem).text().trim();
            titles.push(title);
        });
        const dates = [];
        const authors = [];
        $("div.pre-info.pre-footer > div > div:nth-child(1)").each((idx, elem) => {
            const item = $(elem).text().trim();
            const author = item
                .substring(item.indexOf("by") + 2, item.indexOf("at"))
                .trim();
            authors.push(author);
            const date = item.substring(item.indexOf("at") + 2).trim();
            dates.push(date);
        });
        const cardContents = [];
        $("div.well.well-sm.well-white.pre > div > ol").each((idx, elem) => {
            const item = $(elem).text().trim();
            cardContents.push(item);
        });
        // browser.close();
        const lastEntry = await Data.findOne({
            attribute: ["date"],
            order: [["date", "DESC"]],
        });
        const data = titles
            .map((item, index) => {
                if (new Date(dates[index]).valueOf() > lastEntry.date.valueOf()) {
                    return {
                        title: item,
                        content: cardContents[index],
                        date: dates[index],
                        author: authors[index],
                    };
                }
            })
            .filter((item) => !!item);
        if (data.length > 0) {
            await Data.bulkCreate(data);
            console.table(data)
        } else {
            console.log("Scrapper didn't found new information");
        }
    } catch (error) {
        console.error(error.message);
    }
};