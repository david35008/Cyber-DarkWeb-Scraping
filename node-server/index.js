require('dotenv').config();
const alertingFinder = require("./AlertingFinder");

const app = require('./app');

const port = process.env.PORT || 8080;

async function runAlertFinderInterval() {
    alertingFinder();
    setInterval(() => {
        alertingFinder();
    }, 1000 * 60 * 2);
}

runAlertFinderInterval();

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
