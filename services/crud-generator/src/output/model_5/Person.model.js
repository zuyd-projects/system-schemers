
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Person = sequelize.define("Person", {
    name: { type: DataTypes.STR },
    email: { type: DataTypes.STR },
    birthdate: { type: DataTypes.DATE }
});

module.exports = Person;
