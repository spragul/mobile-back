var express = require('express');
var { dbUrl } = require('../dbconfig/dbconfig');
var mongoose = require('mongoose');
const router = express.Router();
const { userModel } = require('../schema/userschema');
const { hashpassword, hashCompare, createToken } = require('../dbconfig/auth');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');

mongoose.connect(dbUrl).then(() => {
    console.log('connected to db');
})
//signup 
router.post('/signup', async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        console.log(user)
        if (!user) {
            let hashedpassword = await hashpassword(req.body.password);
            req.body.password = hashedpassword;
            let data = await userModel.create(req.body);
            res.status(200).send({
                message: "User Signup Successfull!"
            })
        } else {
            res.status(400).send({ message: "user alreay Exists" })
        }

    } catch (error) {
        res.status(500).send({ message: `Internal server error.\n\n${error}` });
        console.log(error)

    }
})

//login 
router.post('/login', async (req, res) => {
    try {

        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
            timeExpires = '2h'
            if (await hashCompare(req.body.password, user.password)) {
                let token = await createToken({
                    name: user.name,
                    email: user.email
                }, timeExpires)
                res.status(200).send({
                    message: "Login successful",
                    token
                });
            } else {
                res.status(402).send({ message: "Invalid Credentials" })
            }

        } else {
            res.status(400).send({ message: "user does not exists!" })
        }
    } catch (error) {
        res.status(500).send({ message: `Internal server error.\n\n${error}` });
        console.log(error)

    }
})

//forgotpassword
router.post("/forgotpassword", async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        timeExpires = '10m'
        if (!user) {
            res.send({ message: "user not exists" })
        } else {
            const token = await createToken({
                email: user.email,
                id: user._id
            }, timeExpires)
            console.log(token, user._id)
            const link = `https://fanciful-hummingbird-57ab9e.netlify.app/user/resetpassword/${user._id}/${token}`

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.G_MAIL,
                    pass: process.env.G_MAIL_PASSWORD,
                }
            });
            var mailOptions = {
                from: process.env.G_MAIL,
                to: user.email,
                subject: 'Reset password',
                text: link
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send(error)
                } else {
                    res.send({ message: "mail send " })
                }
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Internal server error.\n\n${error}` });
    }
})

//resetpassword
router.post('/resetpassword/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    try {
        const olduser = await userModel.findOne({ _id: id });
        if (!olduser) {
            res.send({ message: "user not exists" })
        } else {
            const verify = jwt.verify(token, process.env.secretKey);
            const encryptedPassword = await hashpassword(req.body.password)
            await userModel.updateOne(
                {
                    _id: id
                },
                {
                    $set: {
                        password: encryptedPassword,
                    }
                }
            );
            res.status(200).send({
                message: "password reset"
            })
        }
    } catch (error) {
        console.log(error)
        res.send({ message: "Something Went Wrong" })
    }
})

module.exports = router;