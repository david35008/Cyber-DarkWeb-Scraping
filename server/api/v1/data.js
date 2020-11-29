const scrapperRouter = require('express').Router();
const { Data } = require('../../models');

// get all data
scrapperRouter.get('/', async (req, res) => {
    try {
        const allData = await Data.findAll({});
        res.json(allData);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Cannot process request' });
    }
});

// add data
scrapperRouter.post('/', async (req, res) => {
    try {
        const destructedData = {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            date: req.body.date,
        };
        await Data.create(destructedData);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Cannot process request' });
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
