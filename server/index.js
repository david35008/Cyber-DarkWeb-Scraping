require('dotenv').config();
const scrapper = require('./Scrapper/axios-scrapper');
const alertingFinder = require("./AlertingFinder");

const app = require('./app');

const port = process.env.PORT || 8080;

async function runScrapperInterval() {
    scrapper();
    setInterval(() => {
        scrapper();
    }, 1000 * 60 * 2)
}

async function runAlertFinderInterval() {
    alertingFinder();
    setInterval(() => {
        alertingFinder();
    }, 1000 * 60 * 2);
}

runScrapperInterval();
runAlertFinderInterval();

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
