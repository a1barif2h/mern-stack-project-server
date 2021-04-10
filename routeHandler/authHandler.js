const express = require("express");
const mongoose = require("mongoose")
const authSchema = require("../schemas/authSchema");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = new mongoose.model("USER", authSchema);


router.post("/register", async (req, res) => {
    try {
        const {name, email, phone, work, password, confirmPassword} = req.body;
        const userExist = await User.findOne({email: email});
        const newUser = new User({name, email, phone, work, password, confirmPassword});

        if(!name || !email || !phone || !work || !password || !confirmPassword) {
            return res.status(400).json({error: "Please file all field first!"})
        } else if(password !== confirmPassword) {
            return res.status(400).json({error: "Password and confirm password should be the same!"})
        } else if (userExist) {
            return res.status(422).json({error: "Email already exist!"})
        } else {
            await newUser.save(err => {
                if(err) {
                    res.status(500).json({error: "There was server side error!"})
                }else {
                    res.status(200).json({message: "User registered successfully!"})
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
});

router.post("/signin", async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({error: "Please file all field first!"})
        }
        const userLogin = await User.findOne({email: email});
        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true
            })
            console.log(token);
            if(!isMatch) {
                return res.status(404).json({error: "Credentials not match!"})
            } else {
                return res.status(200).json({message: "User login successfully!"})
            }
        } else {
            return res.status(404).json({error: "Credentials not match!"})
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;