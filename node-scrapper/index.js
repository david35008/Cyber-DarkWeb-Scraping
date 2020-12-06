require("dotenv").config();
const scrapper = require("./scrapper-axios");
const generalScrapper = require("./general-scrapper");

async function runDarkWebScrapper() {
    scrapper();
    console.log("scrapper is running");
    setInterval(() => {
        console.log("scrapper is running");
        scrapper();
    }, 1000 * 60 * 2);
}

async function runGenericScrapper() {
    generalScrapper(process.env.CONFIGURATION, 5);
    console.log("scrapper is running");
    setInterval(() => {
        console.log("scrapper is running");
        generalScrapper(process.env.CONFIGURATION, 1);
    }, 1000 * 60 * 2);
}

setTimeout(() => {
    runGenericScrapper();
}, 1000 * 30);

console.log('Scrapper Ready');
