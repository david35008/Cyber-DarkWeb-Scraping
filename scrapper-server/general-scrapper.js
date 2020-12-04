require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
const SocksAgent = require("axios-socks5-agent");
const yaml = require("js-yaml");
const fs = require("fs");


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

module.exports = async function main(ymlFile) {

    const config = yaml.safeLoad(
        fs.readFileSync(`./${ymlFile}.yml`, "utf8")
    );
    console.log(config["scrapper-url"]);
    try {
        const links = [];
        let $ = await pageLoader(config["scrapper-url"])
        $(config["tasks"]["get-pastes-links"]["html-tag"]).each((idx, elem) => {
            links.push(elem.attribs.href);
        });
        let pageSum = 1
        while ($(`${config["pages-system"]}`).last().children()[0].attribs.href) {
            console.log('Try Page ', pageSum);
            console.log($(`${config["pages-system"]}`).last().children()[0].attribs.href);
            $ = await pageLoader($(`${config["pages-system"]}`).last().children()[0].attribs.href)
            $(config["tasks"]["get-pastes-links"]["html-tag"]).each((idx, elem) => {
                links.push(elem.attribs.href);
            });
        }

        console.log(links);

        const titles = [];
        const contents = [];
        const dates = [];
        const authors = [];

        await Promise.all(
            links.map(async (link) => {
                // if ()
                const { data: linkContent } = await axios.get(link, {
                    httpAgent,
                    httpsAgent,
                });
                const $$ = cheerio.load(linkContent);
                $$(config["tasks"]["get-pastes-titles"]["html-tag"]).each(
                    (idx, elem) => {
                        const title = $$(elem).text().trim();
                        // console.log(title);
                        titles.push(title);
                    }
                );
                $$(config["tasks"]["get-pastes-contents"]["html-tag"]).each(
                    (idx, elem) => {
                        const content = $$(elem).text().trim();
                        // console.log(content);
                        contents.push(content);
                    }
                );
                $$(config["tasks"]["get-pastes-authors"]["html-tag"]).each(
                    (idx, elem) => {
                        if (config["dark-web"]) {
                            const authorFull = $$(elem).text().trim();
                            const author = authorFull
                                .substring(
                                    authorFull.indexOf("by") + 2,
                                    authorFull.indexOf("at")
                                )
                                .trim();
                            // console.log(author);
                            authors.push(author);
                        }
                    }
                );
                $$(config["tasks"]["get-pastes-dates"]["html-tag"]).each(
                    (idx, elem) => {
                        if (config["dark-web"]) {
                            const dateFull = $$(elem).text().trim();
                            const date = dateFull
                                .substring(dateFull.indexOf("at") + 2)
                                .trim();
                            // console.log(date);
                            dates.push(date);
                        }
                    }
                );
            })
        );

        const combinedData = titles
            .map((item, index) => {
                return {
                    title: item,
                    content: contents[index],
                    date: dates[index],
                    author: authors[index],
                };
            })
        console.log(combinedData.length);

        //     const { data: lastEntry } = await axios.get(
        //       `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/last-entry`
        //     );

        //     const dataForDB = combinedData
        //       .filter((item, index) =>
        //         new Date(dates[index]).valueOf() > (lastEntry ? new Date(lastEntry.date).valueOf() : 0)
        //       )

        //     if (dataForDB.length > 0) {
        //       console.table(dataForDB)
        //       console.log(`There Is ${dataForDB.length} New Data`);
        //     } else {
        //       console.log("Scrapper didn't found new information");
        //     }
        //     await axios.post(
        //       `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data`,
        //       {
        //         data: dataForDB,
        //       }
        //     );
        //   } catch (error) {
        //     try {
        //       console.error(error.message);
        //       await axios.post(
        //         `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/error`,
        //         {
        //           error: error.message,
        //         }
        //       );
    } catch (error) {
        console.error(error.message);
    }
    // }
};
