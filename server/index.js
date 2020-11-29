require('dotenv').config();
const scrapper = require('./Scrapper');

const app = require('./app');

const port = process.env.PORT || 8080;

async function runScrapperInterval() {
    scrapper();
//     const scrapperInterval = setInterval(() => {
//         scrapper();
//         console.log('run scrapper is on');
//     }, 1000 * 60 * 2)
}

runScrapperInterval();

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
