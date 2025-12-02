const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Work = require('../models/Relations').Work;

const create = async (req, res) => {
    try {
        const { name, review, comment, attachment_date, file, proposal_Id, user_Id } = req.body;
        const work = await Work.create({ name, review, comment, attachment_date, file, proposal_Id, user_Id });
        return res.status(201).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        let cacheData = {};
        if (fs.existsSync(cache)) {
            try {
                const fileContent = fs.readFileSync(cache, 'utf-8');
                if (fileContent) cacheData = JSON.parse(fileContent);
            } catch (err) { console.error(err); }
        }

        if (cacheData.works && cacheData.works.length > 0) {
            return res.status(200).json(cacheData.works);
        }

        const works = await Work.findAll({});
        cacheData.works = works;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const works = await Work.findAll({
            include: [
                {
                    model: require('../models/Relations').Proposal,
                    attributes: ['name', 'status']
                },
                {
                    model: require('../models/Relations').User,
                    attributes: ['login', 'email']
                }
            ]
        });
        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const result = await Work.destroy({ where: { work_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const { attachment_date, review, comment, name, file, proposal_Id, user_Id } = req.body;
        const work = await Work.update({ attachment_date, review, comment, name, file, proposal_Id, user_Id }, {where: {work_Id}});
        return res.status(200).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    deleter,
    update,
    getFromDb
};

