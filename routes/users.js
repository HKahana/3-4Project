const express = require("express");
const bcrypt = require("bcrypt");
const { UsersModel, validUser, validLogin, createToken } = require("../models/usersModel.js");
const router = express.Router();

router.post("/", async(req, res) => {
    let validBody = validUser(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UsersModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "*******";

        res.status(201).json(user);
    } 
    catch (error) {
        if(error.code == 11000){
            return res.status(500).json({msg:"Email already in system. Try to log in"});
        }
        console.log(error);
        res.status(500).json({msg:"error", error});
    }
})

router.post("/login", async(req, res) => {
    let validBody = validLogin(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UsersModel.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({msg:"Email or password incorrect. Try again"})
        }

        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if(!authPassword){
            return res.status(401).json({msg:"Email or password incorrect. Try again"})
        }

        let token = createToken(user._id, user.role);
        res.json({token});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({msg:"error", error});
    }
})

module.exports = router;