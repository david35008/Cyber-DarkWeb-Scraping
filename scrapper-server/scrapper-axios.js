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


async function pageLoader(url) {
  const { data: content } = await axios.get(
    url,
    {
      httpAgent,
      httpsAgent,
    }
  );

  const $ = cheerio.load(content);

  return $
}

module.exports = async function main() {
  try {
    const titles = [];
    const dates = [];
    const authors = [];
    const cardContents = [];

    let $ = await pageLoader("http://nzxj65x32vh2fkhk.onion/all")
    let pageSum = 1
    while (!$(".pagination > li").last().hasClass('disabled')) {
      console.log('Try Page ', pageSum);
      $ = await pageLoader(`http://nzxj65x32vh2fkhk.onion/all?page=${pageSum}`)
      console.log('There iS More New Pages?', !$(".pagination > li").last().hasClass('disabled'));
      $("h4").each((idx, elem) => {
        const title = $(elem).text().trim();
        titles.push(title);
      });

      $("div.pre-info.pre-footer > div > div:nth-child(1)").each((idx, elem) => {
        const item = $(elem).text().trim();
        const author = item
          .substring(item.indexOf("by") + 2, item.indexOf("at"))
          .trim();
        authors.push(author);
        const date = item.substring(item.indexOf("at") + 2).trim();
        dates.push(date);
      });

      $("div.well.well-sm.well-white.pre > div > ol").each((idx, elem) => {
        const item = $(elem).text().trim();
        cardContents.push(item);
      });
      pageSum++
    }

    const combinedData = titles
      .map((item, index) => {
        return {
          title: item,
          content: cardContents[index],
          date: dates[index],
          author: authors[index],
        };
      })

    const { data: lastEntry } = await axios.get(
      `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/last-entry`
    );

    const dataForDB = combinedData
      .filter((item, index) =>
        new Date(dates[index]).valueOf() > (lastEntry ? new Date(lastEntry.date).valueOf() : 0)
      )

    if (dataForDB.length > 0) {
      console.table(dataForDB)
      console.log(`There Is ${dataForDB.length} New Data`);
    } else {
      console.log("Scrapper didn't found new information");
    }
    await axios.post(
      `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data`,
      {
        data: dataForDB,
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
