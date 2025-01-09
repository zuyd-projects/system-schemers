const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Base URL of the Metamodel Service
const METAMODEL_SERVICE_URL = "http://localhost:5005/api";

async function generateCRUD(modelId, outputDir) {
    // Ensure the output directory exists
    await fs.ensureDir(outputDir);

    // Fetch ObjectTypes and Attributes from Metamodel Service
    const objectTypes = await fetchObjectTypes(modelId);

    // Generate files for each ObjectType
    for (const objectType of objectTypes) {
        const { attributes, name } = objectType;

        // Generate Database Schema
        const schema = generateDatabaseSchema(name, attributes);
        await fs.writeFile(path.join(outputDir, `${name}.sql`), schema);

        // Generate ORM Model
        const modelCode = generateORMModel(name, attributes);
        await fs.writeFile(path.join(outputDir, `${name}.model.js`), modelCode);

        // Generate API Routes
        const routeCode = generateAPIRoutes(name);
        await fs.writeFile(path.join(outputDir, `${name}.routes.js`), routeCode);
    }

    console.log("CRUD application successfully generated.");
}

async function fetchObjectTypes(modelId) {
    // Fetch ObjectTypes for the given modelId
    const objectTypesResponse = await axios.get(`${METAMODEL_SERVICE_URL}/objectType`);
    const attributesResponse = await axios.get(`${METAMODEL_SERVICE_URL}/attribute`);

    // Filter ObjectTypes by modelId
    const objectTypes = objectTypesResponse.data.filter((obj) => obj.modelId === modelId);

    // Attach attributes to each ObjectType
    objectTypes.forEach((objectType) => {
        objectType.attributes = attributesResponse.data.filter(
            (attr) => attr.objectTypeId === objectType.id
        );
    });

    return objectTypes;
}

function generateDatabaseSchema(name, attributes) {
    let schema = `CREATE TABLE ${name} (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
    for (const attr of attributes) {
        schema += `  ${attr.name} ${attr.datatype.toUpperCase()},\n`;
    }
    schema += "  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n";
    return schema;
}

function generateORMModel(name, attributes) {
    return `
const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ${name} = sequelize.define("${name}", {
${attributes
    .map(
        (attr) => `    ${attr.name}: { type: DataTypes.${attr.datatype.toUpperCase()} }`
    )
    .join(",\n")}
});

module.exports = ${name};
`;
}

function generateAPIRoutes(name) {
    return `
const express = require("express");
const { ${name} } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newRecord = await ${name}.create(req.body);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const records = await ${name}.findAll();
    res.json(records);
});

router.get("/:id", async (req, res) => {
    const record = await ${name}.findByPk(req.params.id);
    record ? res.json(record) : res.status(404).json({ error: "Not found" });
});

router.put("/:id", async (req, res) => {
    const record = await ${name}.findByPk(req.params.id);
    if (record) {
        await record.update(req.body);
        res.json(record);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.delete("/:id", async (req, res) => {
    const record = await ${name}.findByPk(req.params.id);
    if (record) {
        await record.destroy();
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

module.exports = router;
`;
}

module.exports = { generateCRUD };