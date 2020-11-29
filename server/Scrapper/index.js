const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Data } = require("../models");

module.exports = async function main() {
    const browser = await puppeteer.launch({
        // headless: false,
        args: ["--proxy-server=socks5://127.0.0.1:9050"],
    });
    const page = await browser.newPage();
    await page.goto("http://nzxj65x32vh2fkhk.onion/all");
    const content = await page.content();
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
    browser.close();
    const lastEntry = await Data.findOne({
        attribute: ["date"],
        order: [["date", "DESC"]],
    });
    console.log(lastEntry.date.valueOf());
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
    await Data.bulkCreate(data);
    console.log(data);
};