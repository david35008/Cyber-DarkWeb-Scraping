const keyWordRouter = require("express").Router();
const { KeyWord, Alert } = require("../../models");
const alertsFinder = require("../../AlertingFinder");

// get all KeyWords
keyWordRouter.get("/", async (req, res) => {
    try {
        const allKeyWords = await KeyWord.findAll();
        res.json(allKeyWords);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// add KeyWord
keyWordRouter.post("/", async (req, res) => {
    try {
        const { keyWord } = req.body;

        const keyWordExists = await KeyWord.findOne({
            where: { keyWord },
        });

        if (keyWordExists) {
            res.status(304).json({ message: "KeyWord already exists" });
        } else {
            await KeyWord.create({ keyWord });
            alertsFinder();
            res.sendStatus(201);
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// update KeyWord
keyWordRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { keyWord } = req.body;
        const editKeyWord = await KeyWord.update(keyWord, {
            where: {
                id,
            },
        });
        res.json(editKeyWord);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// delete KeyWord
keyWordRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const keyWordToDelete = await KeyWord.findByPk(id);
        if (keyWordToDelete) {
            await KeyWord.destroy({
                where: {
                    id,
                },
            });
            await Alert.destroy({
                where: { keyWord: keyWordToDelete.keyWord },
                force: true,
            });
            res.sendStatus(204);
        } else {
            res.status(404).json({ message: "Cannot find keyWord" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

module.exports = keyWordRouter;
