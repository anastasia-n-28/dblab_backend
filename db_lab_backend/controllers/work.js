const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Work = require('../models/Relations').Work;

const create = async (req, res) => {
    try {
        const { attachment_date, review, comment, name, file, proposal_Id, user_Id } = req.body;
        const work = await Work.create({ attachment_date, review, comment, name, file, proposal_Id, user_Id });
        return res.status(201).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const cacheData = JSON.parse(fs.readFileSync(cache, 'utf-8'));
        if (!cacheData.works) {
            return res.status(404).json({ message: 'work not found in cache.' });
        }
        return res.status(200).json(cacheData.works);
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

