const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const FactType = sequelize.define('FactType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(30), allowNull: false },
    description: { type: DataTypes.STRING(300) },
    concId: { type: DataTypes.STRING(15) },
    cnstId: { type: DataTypes.STRING(15) },
    predicatorSetType: { type: DataTypes.STRING(20) },
});

module.exports = FactType;