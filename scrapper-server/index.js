require("dotenv").config();
const scrapper = require("./scrapper-axios");

async function runScrapperInterval() {
    scrapper();
    console.log("scrapper is running");
    setInterval(() => {
        console.log("scrapper is running");
        scrapper();
    }, 1000 * 60 * 2);
}

// setTimeout(() => {
    runScrapperInterval();
// }, 1000 * 60);

