const { Op } = require("sequelize");
const { Data, KeyWord, Alert } = require("../models");

module.exports = async function alertingFinder() {
    console.log('Start Alerting Key Word Search');
    try {
        const keyWords = await KeyWord.findAll();

        keyWords.forEach(async (keyWord) => {
            const timeStampObj = await Alert.findOne({
                attribute: ["createdAt"],
                where: { keyWord: keyWord.keyWord },
                paranoid: false,
                order: [["createdAt", "DESC"]],
            });

            const timeStamp = timeStampObj ? timeStampObj.createdAt : 0;

            const partialKeyWordData = await Data.findAll({
                where: {
                    [Op.or]: [
                        { author: { [Op.substring]: `${keyWord.keyWord}` } },
                        { title: { [Op.substring]: `${keyWord.keyWord}` } },
                        { content: { [Op.substring]: `${keyWord.keyWord}` } },
                    ],
                    createdAt: { [Op.gt]: timeStamp },
                },
                order: [["date", "DESC"]],
            });

            const fullKeyWordData = await Data.findAll({
                where: {
                    [Op.or]: [
                        { author: { [Op.like]: `${keyWord.keyWord} %` } },
                        { title: { [Op.like]: `${keyWord.keyWord} %` } },
                        { content: { [Op.like]: `${keyWord.keyWord} %` } },
                        { author: { [Op.like]: `% ${keyWord.keyWord} %` } },
                        { title: { [Op.like]: `% ${keyWord.keyWord} %` } },
                        { content: { [Op.like]: `% ${keyWord.keyWord} %` } },
                        { author: { [Op.like]: `% ${keyWord.keyWord}` } },
                        { title: { [Op.like]: `% ${keyWord.keyWord}` } },
                        { content: { [Op.like]: `% ${keyWord.keyWord}` } },
                    ],
                    createdAt: { [Op.gt]: timeStamp },
                },
                order: [["date", "DESC"]],
            });
            const filteredPartialKeyWordData = partialKeyWordData.filter((partialElement) =>
                !fullKeyWordData.some((fullElement) =>
                    fullElement.id === partialElement.id)
            );

            const partialAlertData = filteredPartialKeyWordData.map((element) => {
                return {
                    dataId: element.id,
                    keyWord: keyWord.keyWord,
                    match: "partial",
                };
            });

            const fullAlertData = fullKeyWordData.map((element) => {
                return {
                    dataId: element.id,
                    keyWord: keyWord.keyWord,
                    match: "full",
                };
            });

            const allData = [...partialAlertData, ...fullAlertData];
            console.log(keyWord.keyWord);
            console.log(timeStamp);
            console.log("allData", allData);
            await Alert.bulkCreate(allData);
        });
        console.log('Alerting Key Word Search Done!!');
    } catch (error) {
        console.error('Alerting Finder Error')
        console.error(error);
    }
};
