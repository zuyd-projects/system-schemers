
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Application = sequelize.define("Application", {
    name: { type: DataTypes.STR },
    location: { type: DataTypes.STR },
    employees: { type: DataTypes.LIST }
});

module.exports = Application;
