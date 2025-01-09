const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Model = sequelize.define('Model', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(30), allowNull: false },
    description: { type: DataTypes.STRING(200) },
    version: { type: DataTypes.INTEGER },
});

module.exports = Model;