const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const FactType = require('./FactType');
const ObjectType = require('./ObjectType');

const Predicator = sequelize.define('Predicator', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    factTypeId: { type: DataTypes.INTEGER, references: { model: FactType, key: 'id' } },
    objectTypeId: { type: DataTypes.INTEGER, references: { model: ObjectType, key: 'id' } },
    multiplicity: { type: DataTypes.STRING(30) },
    verb: { type: DataTypes.STRING(30) },
});

FactType.hasMany(Predicator, { foreignKey: 'factTypeId', as: 'predicators' });
Predicator.belongsTo(FactType, { foreignKey: 'factTypeId' });

ObjectType.hasMany(Predicator, { foreignKey: 'objectTypeId', as: 'predicators' });
Predicator.belongsTo(ObjectType, { foreignKey: 'objectTypeId' });

module.exports = Predicator;