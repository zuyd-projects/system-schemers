const express = require('express');
const { ObjectType, Attribute, FactType, Predicator, Model } = require('../models');

const router = express.Router();

// Mapping table names to Sequelize models
const entityMap = {
    objecttype: ObjectType,
    attribute: Attribute,
    facttype: FactType,
    predicator: Predicator,
    model: Model,
};

// Generic CRUD route
router.post('/:entity', async (req, res) => {
    try {
        const { entity } = req.params;
        const EntityModel = entityMap[entity.toLowerCase()];

        if (!EntityModel) {
            return res.status(400).json({ error: `Unknown entity: ${entity}` });
        }

        // Create a new entry in the specified table
        const newEntity = await EntityModel.create(req.body);
        res.status(201).json(newEntity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:entity/:id?', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const EntityModel = entityMap[entity.toLowerCase()];

        if (!EntityModel) {
            return res.status(400).json({ error: `Unknown entity: ${entity}` });
        }

        // Fetch a single record or all records
        if (id) {
            const record = await EntityModel.findByPk(id);
            if (!record) {
                return res.status(404).json({ error: `${entity} with ID ${id} not found` });
            }
            res.status(200).json(record);
        } else {
            const records = await EntityModel.findAll();
            res.status(200).json(records);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:entity/:id', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const EntityModel = entityMap[entity.toLowerCase()];

        if (!EntityModel) {
            return res.status(400).json({ error: `Unknown entity: ${entity}` });
        }

        // Update a record
        const record = await EntityModel.findByPk(id);
        if (!record) {
            return res.status(404).json({ error: `${entity} with ID ${id} not found` });
        }

        await record.update(req.body);
        res.status(200).json(record);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:entity/:id', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const EntityModel = entityMap[entity.toLowerCase()];

        if (!EntityModel) {
            return res.status(400).json({ error: `Unknown entity: ${entity}` });
        }

        // Delete a record
        const record = await EntityModel.findByPk(id);
        if (!record) {
            return res.status(404).json({ error: `${entity} with ID ${id} not found` });
        }

        await record.destroy();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;