const scrapperRouter = require('express').Router();
const eventEmitter = require("../../Helpers/EventEmitter");
const { Op } = require('sequelize');
const { Data } = require('../../models');
const ner = require("wink-ner");
const winkTokenizer = require("wink-tokenizer");
const Sentiment = require("sentiment");
//=================sentiment config======================//
const sentiment = new Sentiment();
//================NER Analysis config=====================//
const myNER = ner();
const trainingData = [
    { text: "%", entityType: "percent" },
    { text: "sql", entityType: "Data" },
    { text: "mongo-db", entityType: "Data" },
    { text: "data", entityType: "Data" },
    { text: "information", entityType: "Data" },
    { text: "info", entityType: "Data" },
    { text: "gun", entityType: "weapons" },
    { text: "weapons", entityType: "weapons" },
    { text: "rifle", entityType: "weapons" },
    { text: "sword", entityType: "weapons" },
    { text: "explosives", entityType: "weapons" },
    { text: "bomb", entityType: "weapons" },
    { text: "handgun", entityType: "weapons" },
    { text: "smg", entityType: "weapons" },
    { text: "weapon", entityType: "weapons" },
    { text: "instagram", entityType: "social media" },
    { text: "facebook", entityType: "social media" },
    { text: "twitter", entityType: "social media" },
    { text: "whatsapp", entityType: "social media" },
    { text: "hack", entityType: "hacking" },
    { text: "hacker", entityType: "hacking" },
    { text: "hacked", entityType: "hacking" },
    { text: "exploit", entityType: "hacking" },
    { text: "bitcoin", entityType: "bitcoin" },
];
const tokenize = winkTokenizer().tokenize;
myNER.learn(trainingData);

// get all data
scrapperRouter.get("/", async (req, res) => {
    try {
        const { query } = req.query;
        let allData = [];
        if (query) {
            allData = await Data.findAll({
                where: {
                    [Op.or]: [
                        { author: { [Op.like]: `%${query}%` } },
                        { title: { [Op.like]: `%${query}%` } },
                        { content: { [Op.like]: `%${query}%` } },
                    ],
                },
                order: [["date", "DESC"]],
            });
        } else {
            allData = await Data.findAll({ order: [["date", "DESC"]] });
        }
        const nerAnalysisData = allData.map((element) => {
            const contentTokens = tokenize(element.dataValues.content);
            const titleTokens = tokenize(element.dataValues.title);
            const tokens = [...contentTokens, ...titleTokens];
            const results = myNER.recognize(tokens);
            const entities = new Set(
                results.map((result) => result.entityType).filter((x) => !!x)
            );
            const tags = new Set(
                results
                    .map((result) => result.tag)
                    .filter(
                        (tag) => tag === "url" || tag === "currency" || tag === "email"
                    )
            );
            element.dataValues.nerAnalysis = [...tags, ...entities];
            return element;
        });

        const allDataWithScore = nerAnalysisData.map((element) => {
            const titleResult = sentiment.analyze(element.title);
            const contentResult = sentiment.analyze(element.content);
            const authorResult = sentiment.analyze(element.author);
            element.dataValues.score =
                titleResult.score + contentResult.score + authorResult.score;
            return element;
        });

        res.json(allDataWithScore);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// lastEntry data
scrapperRouter.get("/last-entry", async (req, res) => {
    try {
        const lastEntry = await Data.findOne({
            attribute: ["date"],
            order: [["date", "DESC"]],
        });
        res.status(200).json(lastEntry);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});



scrapperRouter.get("/:sentimentParam", async (req, res) => {
    try {
        const { sentimentParam } = req.params;
        const { query } = req.query;
        let allData = [];
        if (query) {
            allData = await Data.findAll({
                where: {
                    [Op.or]: [
                        { author: { [Op.like]: `%${query}%` } },
                        { title: { [Op.like]: `%${query}%` } },
                        { content: { [Op.like]: `%${query}%` } },
                    ],
                },
                order: [["date", "DESC"]],
            });
        } else {
            allData = await Data.findAll({ order: [["date", "DESC"]] });
        }
        const nerAnalysisData = allData.map((element) => {
            const contentTokens = tokenize(element.dataValues.content);
            const titleTokens = tokenize(element.dataValues.title);
            const tokens = [...contentTokens, ...titleTokens];
            const results = myNER.recognize(tokens);
            const entities = new Set(
                results.map((result) => result.entityType).filter((x) => !!x)
            );
            const tags = new Set(
                results
                    .map((result) => result.tag)
                    .filter(
                        (tag) => tag === "url" || tag === "currency" || tag === "email"
                    )
            );
            element.dataValues.nerAnalysis = [...tags, ...entities];
            return element;
        });



        const allDataWithScore = nerAnalysisData.map((element) => {
            const titleResult = sentiment.analyze(element.title);
            const contentResult = sentiment.analyze(element.content);
            const authorResult = sentiment.analyze(element.author);
            element.dataValues.score =
                titleResult.score + contentResult.score + authorResult.score;
            return element;
        });
        let sentimentalData = [];
        if (sentimentParam === "negative") {
            sentimentalData = allDataWithScore
                .filter((element) => element.dataValues.score < 0)
                .sort((a, b) => a.dataValues.score - b.dataValues.score);
        } else if (sentimentParam === "positive") {
            sentimentalData = allDataWithScore
                .filter((element) => element.dataValues.score > 0)
                .sort((a, b) => b.dataValues.score - a.dataValues.score);
        } else {
            sentimentalData = allDataWithScore;
        }
        res.json(sentimentalData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});
// add data
scrapperRouter.post("/", async (req, res) => {
    try {
        const { data } = req.body;
        await Data.bulkCreate(data);
        if (data.length > 0) {
            eventEmitter.emit("newData", data.length);
        } else {
            console.log("There is No New Data");
        }
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// error data
scrapperRouter.post("/error", async (req, res) => {
    try {
        const { error } = req.body;
        console.error(error);
        eventEmitter.emit("scrapperFailed");
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// update data
scrapperRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const destructedData = {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            date: req.body.date,
        };
        const editData = await Data.update(destructedData, {
            where: {
                id,
            },
        });
        res.json({ message: 'Edited Success' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Cannot process request' });
    }
});

// delete data
scrapperRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Data.destroy({
            where: {
                id,
            },
        });
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Cannot process request' });
    }
});


module.exports = scrapperRouter;
