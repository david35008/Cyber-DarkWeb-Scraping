require('dotenv').config();
const scrapper = require('./Scrapper/axios-scrapper');

const app = require('./app');

const port = process.env.PORT || 8080;

async function runScrapperInterval() {
    scrapper();
    setInterval(() => {
        scrapper();
        console.log('Scrapper Searched For New Information');
    }, 1000 * 60 * 2)
}

runScrapperInterval();

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
