require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
const SocksAgent = require("axios-socks5-agent");
const yaml = require("js-yaml");
const fs = require("fs");
const moment = require("moment");

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
        let pageSum = 1
        if (config["next-page"]) {
            console.log('Try Page ', pageSum);
            $(config["tasks"]["get-pastes-links"]["html-tag"]).each((idx, elem) => {
                links.push(elem.attribs.href);
            });
            while (pageSum <= 2 && $(config["next-page"])[0]) {
                pageSum++
                console.log('Try Page ', pageSum);
                let nextPage = $(config["next-page"])[0].attribs.href
                if (nextPage.includes('http')) {
                    $ = await pageLoader(`${$(config["next-page"])[0].attribs.href}`)
                } else {
                    $ = await pageLoader(`${config["base-url"]}${$(config["next-page"])[0].attribs.href}`)
                }
                $(config["tasks"]["get-pastes-links"]["html-tag"]).each((idx, elem) => {
                    links.push(elem.attribs.href);
                });

            }
        } else {
            console.log('have One Page ');
            $(config["tasks"]["get-pastes-links"]["html-tag"]).each((idx, elem) => {
                links.push(elem.attribs.href);
            });
        }

        const titles = [];
        const contents = [];
        const dates = [];
        const authors = [];
        await Promise.all(
            links.map(async (link, index) => {
                if (!(link.startsWith("http") || link.startsWith("https"))) {
                    link = `${config["base-url"]}${link}`;
                }
                const { data: linkContent } = await axios.get(link, {
                    httpAgent,
                    httpsAgent,
                });
                const $$ = cheerio.load(linkContent);
                const title = $$(config["tasks"]["get-pastes-titles"]["html-tag"]).first().text().trim();
                titles.push(title);
                let content = $$(config["tasks"]["get-pastes-contents"]["html-tag"]).first()
                if (config["tasks"]["get-pastes-contents"]["hidden"]) {
                    content = content.attribs.value;
                    contents.push(content);
                } else {
                    content = $$(content).text().trim();
                    contents.push(content);
                }
                if (config["tasks"]["get-pastes-authors"]["html-tag"]) {
                    const authorFull = $$(config["tasks"]["get-pastes-authors"]["html-tag"]).first().text().trim()
                    if (config["tasks"]["get-pastes-authors"]["is-in-string"]) {
                        const author = authorFull
                            .substring(
                                authorFull.indexOf(
                                    config["tasks"]["get-pastes-authors"]["is-in-string"][
                                    "after"
                                    ]
                                ) +
                                config["tasks"]["get-pastes-authors"]["is-in-string"][
                                    "after"
                                ].length,
                                authorFull.indexOf(
                                    config["tasks"]["get-pastes-authors"]["is-in-string"][
                                    "before"
                                    ]
                                )
                            )
                            .trim();
                        authors.push(author);
                    } else {
                        authors.push(authorFull);
                    }
                } else {
                    authors.push("Anonymous");
                }
                const elemDate = $$(config["tasks"]["get-pastes-dates"]["html-tag"]).first()
                if (config["tasks"]["get-pastes-dates"]["is-in-string"]) {
                    const dateFull = $$(elemDate).text().trim()
                    let date;
                    if (
                        config["tasks"]["get-pastes-dates"]["is-in-string"]["before"]
                    ) {
                        date = dateFull
                            .substring(
                                dateFull.lastIndexOf(
                                    config["tasks"]["get-pastes-dates"]["is-in-string"][
                                    "after"
                                    ]
                                ) +
                                config["tasks"]["get-pastes-dates"]["is-in-string"][
                                    "after"
                                ].length,
                                dateFull.lastIndexOf(
                                    config["tasks"]["get-pastes-dates"]["is-in-string"][
                                    "before"
                                    ]
                                )
                            )
                            .trim();
                    } else {
                        date = dateFull.substring(dateFull.lastIndexOf("at") + 2).trim();
                    }
                    if (
                        config["tasks"]["get-pastes-dates"]["is-in-string"]["parse"]
                    ) {
                        const minus = Number(date.slice(0, 1));
                        let timeFormat = date.slice(2).toLowerCase().trim();
                        timeFormat =
                            timeFormat.charAt(timeFormat.length - 1) !== "s"
                                ? timeFormat + "s"
                                : timeFormat;
                        dates.push(moment().subtract(minus, timeFormat).format());
                    } else {
                        if (Date.parse(date) > 0) {
                            dates.push(date);
                        }
                    }
                } else if (config["tasks"]["get-pastes-dates"]["hidden"]) {
                    let date = elemDate.attribs.title;
                    if (date.includes("CET")) {
                        date = date.slice(0, date.indexOf("CET"));
                        date = moment(date).add(1, "h").format();
                    }
                    dates.push(date);
                } else {
                    dates.push(moment(dateFull));
                }

            })
        );
        console.log('titles', titles.length)
        console.log('contents', contents.length)
        console.log('dates', dates.length)
        console.log('authors', authors.length)


        const combinedData = titles
            .map((item, index) => {
                return {
                    title: item,
                    content: contents[index],
                    date: dates[index],
                    author: authors[index],
                };
            })

        const { data: lastEntry } = await axios.get(
            `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data/last-entry`
        );

        const dataForDB = combinedData
            .filter((item, index) => {
                return new Date(dates[index]).valueOf() > (lastEntry ? new Date(lastEntry.date).valueOf() : 0)
            })

        if (dataForDB.length > 0) {
            // console.table(dataForDB)
            console.log(`There Is ${dataForDB.length} New Data`);
        } else {
            console.log("Scrapper didn't found new information");
        }
        // await axios.post(
        //     `http://${process.env.WEBHOOK_IP}:${process.env.WEBHOOK_PORT}/api/v1/data`,
        //     {
        //         data: dataForDB,
        //     }
        // );
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
            console.error(error);
        }
    }
};
