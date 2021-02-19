const express = require("express"),
  router = express.Router(),
  carController = require("../controllers/carController.js");

// get all cars
router.get("/", carController.findAll);

// get car by id
router.get("/:id", carController.findOne);

// create new car
router.post("/", carController.create);

// delete car by id
router.delete("/:id", carController.delete);

module.exports = router;
