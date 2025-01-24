
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Invoice = sequelize.define("Invoice", {
    personName: { type: DataTypes.STR },
    price: { type: DataTypes.FLOAT }
});

module.exports = Invoice;
