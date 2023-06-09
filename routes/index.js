var express = require('express');
const { mobileModel } = require('../schema/indexschema');
var { dbUrl } = require('../dbconfig/dbconfig');
var mongoose = require('mongoose');
var router = express.Router();
mongoose.connect(dbUrl)
const {validate}=require('../dbconfig/auth')

/* GET home page. */
router.get('/',validate, async function (req, res) {
  try {
    let mobile = await mobileModel.find();
    res.status(200).send({
      mobile
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })
  }

});

//inset mobile
router.post('/addmobile',validate, async (req, res) => {
  try {
    let mobile = await mobileModel.findOne({ id: req.body.id })
    if (!mobile) {
      let mobile = await mobileModel.create(req.body);
      res.status(200).send(mobile)
    } else {
      res.status(400).send({ message: "mobile Alreay existed" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Error",
      error
    })
  }
})
//update mobile details
router.put('/mobile/edit/:id',validate, async (req, res) => {
  try {
    console.log(req.params.id);
    let mobile = await mobileModel.findOne({ id: req.params.id })
    if (mobile) {
      mobile.id = req.body.id
      mobile.mobileName = req.body.mobileName
      mobile.image = req.body.image
      mobile.model = req.body.model
      mobile.price = req.body.price
      mobile.Ram = req.body.Ram
      mobile.storage = req.body.storage
      await mobile.save()
      res.status(200).send({
        mobile,
        message: "mobile update successfully"
      })
    } else {
      res.status(400).send({ message: "mobile not exit" })
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" })
  }

})

//delete mobile
router.delete('/mobile/delete/:id',validate, async (req, res) => {
  try {
    let mobile = await mobileModel.findOne({ id: req.params.id })
    if (mobile) {
      let mobile = await mobileModel.deleteOne({ id: req.params.id })
      res.status(200).send({
        message: "mobile Deleted Successfull!"
      })
    }
    else {
      res.status(400).send({ message: "Mobile Does Not Exists!" })
    }

  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error
    })

  }
})



module.exports = router;
