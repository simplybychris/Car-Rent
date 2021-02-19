const Car = require("../models/car.js");

exports.findAll = (req, res) => {
  Car.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving cars.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  console.log("find specified car");
  Car.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Car not found") {
        res.status(404).send({
          message: `Not found Car with id: ${req.params.id}.`,
        });
      } else {
        res.send({});
      }
    } else res.send(data);
  });
};

exports.create = function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Values can not be empty!",
    });
  }

  const car = new Car({
    carId: req.body.car_id,
    date_from: req.body.date_from,
    date_to: req.body.date_to,
  });

  Car.create(car, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error adding Car.",
      });
    else res.send(data);
  });
};

exports.delete = function (req, res) {
  Car.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Car not found") {
        res.status(404).send({
          message: `Not found Car with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Car with id: " + req.params.id,
        });
      }
    } else res.send({ message: `Car deleted successfully!` });
  });
};
