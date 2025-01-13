const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ObjectType = sequelize.define('ObjectType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    modelId: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = ObjectType;