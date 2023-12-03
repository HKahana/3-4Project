const express = require("express");
const { auth } = require("../middlewares/auth.js");
const { ToyModel, validToy } = require("../models/toysModel.js");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let data = await ToyModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage);

        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.get("/search", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let queryS = req.query.s;
        let searchReg = new RegExp(queryS, "i");
        let data = await ToyModel.find({ name: searchReg } || { info: searchReg })
            .limit(perPage)
            .skip((page - 1) * perPage);

        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.get("/category/:catname", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let catname = req.params.catname;
        let catnameReg = new RegExp(catname, "i");
        let data = await ToyModel.find({ category: catnameReg })
            .limit(perPage)
            .skip((page - 1) * perPage);

        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.get("/prices", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let min = req.query.min;
        let max = req.query.max;

        if (!min || !max) {
            return res.status(400).json({ msg: "Both min and max prices are required." });
        }

        let data = await ToyModel.find({
            price: { $gte: min, $lte: max }
        })
            .limit(perPage)
            .skip((page - 1) * perPage);

        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await ToyModel.find({ _id: id });
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toy = new ToyModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        res.status(201).json(toy);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.put("/:editId", auth, async (req, res) => {
    let validBody = validToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToyModel.deleteOne({ _id: delId })
        }
        else {
            data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
        }
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

router.delete("/:delId", auth, async (req, res) => {
    try {
        let delId = req.params.delId;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToyModel.deleteOne({ _id: delId })
        }
        else {
            data = await ToyModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
        }
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "There's a problem. Please try again" });
    }
})

module.exports = router;