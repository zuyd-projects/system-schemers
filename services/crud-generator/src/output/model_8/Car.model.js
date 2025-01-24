
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Car = sequelize.define("Car", {
    make: { type: DataTypes.STR },
    model: { type: DataTypes.STR },
    year: { type: DataTypes.INT },
    parts: { type: DataTypes.LIST }
});

module.exports = Car;
