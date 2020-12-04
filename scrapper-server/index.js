require("dotenv").config();
const scrapper = require("./scrapper-axios");
const generalScrapper = require("./general-scrapper");

async function runScrapperInterval() {
    scrapper();
    console.log("scrapper is running");
    setInterval(() => {
        console.log("scrapper is running");
        scrapper();
    }, 1000 * 60 * 2);
}

// setTimeout(() => {
    generalScrapper('stronghold-config');
// }, 1000 * 60);

console.log('Scrapper Ready');
