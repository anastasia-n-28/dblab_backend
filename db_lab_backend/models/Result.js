const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Result = db.sequelize.define('Result', {
    result_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    work_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    result_type_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    magazine_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    conference_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    competition_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'result',
    timestamps: false
});

module.exports = Result;

