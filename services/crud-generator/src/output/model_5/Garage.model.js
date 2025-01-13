
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Garage = sequelize.define("Garage", {
    location: { type: DataTypes.STR },
    employees: { type: DataTypes.LIST },
    cars: { type: DataTypes.LIST }
});

module.exports = Garage;
