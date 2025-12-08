const path = require('path');
const fs = require('fs');
const { Work, Proposal, User } = require('../models/Relations'); 

const create = async (req, res) => {
    try {
        const { name, review, comment, file, proposal_Id, user_Id } = req.body;
        
        const existingWork = await Work.findOne({
            where: { 
                user_Id, 
                proposal_Id,
                status: ['В обробці', 'Активна']
            }
        });

        if (existingWork) {
            return res.status(400).json({ message: "Ви вже подали заявку на цю тему." });
        }

        const work = await Work.create({ 
            name: name || "Нова заявка", 
            review: review || "Очікує розгляду", 
            comment, 
            begining_date: new Date(),
            changes_date: new Date(),
            file, 
            proposal_Id, 
            user_Id,
            status: 'В обробці'
        });

        if (proposal_Id) {
            await Proposal.update(
                { status: 'Є записи' },
                { where: { proposal_Id: proposal_Id } }
            );
        }

        return res.status(201).json(work);
    } catch (error) {
        console.error("SERVER ERROR in create work:", error);
        return res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const { status, review } = req.body; // status має бути 'Активна' або 'Відхилена'

        const work = await Work.findByPk(work_Id);
        if (!work) return res.status(404).json({ message: "Роботу не знайдено" });

        await work.update({ 
            status, 
            review, // Коментар викладача
            changes_date: new Date()
        });

        return res.status(200).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMyWorks = async (req, res) => {
    try {
        const { user_Id } = req.params;
        const works = await Work.findAll({
            where: { user_Id },
            include: [{ model: Proposal, attributes: ['name'] }]
        });
        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const works = await Work.findAll({});
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
                    model: Proposal,
                    attributes: ['name', 'status']
                },
                {
                    model: User,
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
        const { begining_date, review, comment, name, file, proposal_Id, user_Id } = req.body;
        const work = await Work.update({ begining_date, review, comment, name, file, proposal_Id, user_Id }, {where: {work_Id}});
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