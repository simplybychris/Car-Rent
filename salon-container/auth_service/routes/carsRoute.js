const Car = require("../model/Car");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  Car.findAll()
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.get("/:id", async (req, res) => {
  Car.findById(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.delete("/:id", async (req, res) => {
  Car.findByIdAndDelete(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.put("/:id", async (req, res) => {
  Car.findByIdAndUpdate(req.params.id, {"RegNumber":req.body.regNumber, })
    .then((docs) => {
      res.json({"message":"Car successfully updated"});
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.put("/:carsId/:salonId", async (req, res) => {
  Car.findOneAndUpdate(req.params.id, { "CurrentSalonId": req.params.salonId })
    .then((docs) => {
      res.json({"message":"Car "+req.params.carsId+" successfully transported to salon "+req.params.salonId});
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.post('/',async function(req, res){
    const newCar = new Car({
      Brand:req.body.Brand,
      Model: req.body.Model,
      Year: req.body.Year,
      Capacity: req.body.Capacity,
      RegNumber: req.body.RegNumber,
      SalonId: req.body.SalonId,
      CurrentSalonId: req.body.CurrentSalonId
      });
      try {
        const savedCar = await newCar.save();
        res.send({ car: savedCar._id });
      } catch (err) {
        res.status(400).send(err);
      }
});


module.exports = router;
