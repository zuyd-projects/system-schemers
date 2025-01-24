
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const History = sequelize.define("History", {
    customerHistory: { type: DataTypes.DICT }
});

module.exports = History;
