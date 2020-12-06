const notificationsRouter = require("express").Router();
const eventEmitter = require("../../Helpers/EventEmitter");

notificationsRouter.use(require("../../middleware/serverSentEvents"));
// get all data
notificationsRouter.get("/", (req, res) => {
    eventEmitter.on("notifications-alerts", (data, keyWord) => {
        const notificationsData = {
            name: "notifications-alerts",
            message: `There is ${data} new ${keyWord} Alerts`,
        };
        res.sendEventStreamData(notificationsData);
    });

    eventEmitter.on("notifications-alerts-error", (errorMessage) => {
        const notificationsData = {
            name: "notifications-alerts",
            message: `There was an error ${errorMessage} on alertingFinder`,
        };
        res.sendEventStreamData(notificationsData);
    });

    eventEmitter.on("newData", (data) => {
        const notificationsData = {
            name: "New Data",
            message: `There is ${data} new DarkWeb Posts`,
        };
        res.sendEventStreamData(notificationsData);
    });

    eventEmitter.on("scrapperFailed", () => {
        const notificationsData = {
            name: "scrapperFailed",
            message: "Data collection from a source has failed",
        };
        res.sendEventStreamData(notificationsData);
    });
});

module.exports = notificationsRouter;
