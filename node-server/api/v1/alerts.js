const alertsRouter = require("express").Router();
const { Op } = require("sequelize");
const { Alert, Data } = require("../../models");

// get all data with alerts
alertsRouter.get("/", async (req, res) => {
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
                include: {
                    model: Alert,
                    required: true,
                },
                order: [["date", "DESC"]],
            });
        } else {
            allData = await Data.findAll({
                include: {
                    model: Alert,
                    required: true,
                },
                order: [["date", "DESC"]],
            });
        }
        res.json(allData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

// delete alert
alertsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Alert.destroy({
            where: {
                id,
            },
        });
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Cannot process request" });
    }
});

module.exports = alertsRouter;
