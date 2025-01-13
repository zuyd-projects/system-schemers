const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ObjectType = require('./ObjectType');

const Attribute = sequelize.define('Attribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    datatype: { type: DataTypes.STRING, allowNull: false },
    objectTypeId: {
        type: DataTypes.INTEGER,
        references: { model: ObjectType, key: 'id' },
    },
});

ObjectType.hasMany(Attribute, { foreignKey: 'objectTypeId', as: 'attributes' });
Attribute.belongsTo(ObjectType, { foreignKey: 'objectTypeId' });

module.exports = Attribute;