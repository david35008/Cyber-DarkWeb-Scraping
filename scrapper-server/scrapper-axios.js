require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
const SocksAgent = require("axios-socks5-agent");

const { httpAgent, httpsAgent } = new SocksAgent({
    agentOptions: {
        keepAlive: true,
    },
    host: process.env.IP_ADDRESS,
});

module.exports = async function main() {
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
      const { data: lastEntry } = await axios.get(
        `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/last-entry`
      );
      const data = titles
        .map((item, index) => {
          if (
            new Date(dates[index]).valueOf() >
            (lastEntry ? lastEntry.date.valueOf() : 0)
          ) {
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
            console.table(data)
        } else {
            console.log("Scrapper didn't found new information");
        }
        await axios.post(
            `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data`,
            {
                data: data,
            }
        );
    } catch (error) {
        try {
            console.error(error.message);
            await axios.post(
                `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/error`,
                {
                    error: error.message,
                }
            );
        } catch (error) {
            console.error(error.message);
        }
    }


};
