
const express = require("express");
const { Application } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newRecord = await Application.create(req.body);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const records = await Application.findAll();
    res.json(records);
});

router.get("/:id", async (req, res) => {
    const record = await Application.findByPk(req.params.id);
    record ? res.json(record) : res.status(404).json({ error: "Not found" });
});

router.put("/:id", async (req, res) => {
    const record = await Application.findByPk(req.params.id);
    if (record) {
        await record.update(req.body);
        res.json(record);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.delete("/:id", async (req, res) => {
    const record = await Application.findByPk(req.params.id);
    if (record) {
        await record.destroy();
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

module.exports = router;
