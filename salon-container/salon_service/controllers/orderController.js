const Order = require("../models/order.js");
const Car = require("../models/car.js");

exports.findAll = (req, res) => {
  Order.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders.",
      });
    else res.send(data);
  });
};

exports.transportOrders = (req, res) => {
  Order.getCarsToTransport(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving transport orders.",
      });
    else res.send(data);
  });
};

exports.addReservation = (req, res) => {
  let car = new Car({
    carId: req.body.carsId,
    date_from: req.body.date_from,
    date_to: req.body.date_to,
  });

  let carSalonId = req.body.carSalonId;

  Car.create(car, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error adding Car.",
      });
    let order = new Order({
      clientId: req.body.clientId,
      workerId: req.body.workerId,
      pickupSalonId: req.body.pickupSalonId,
      returnSalonId: req.body.returnSalonId,
      statusId: req.body.statusId,
      carsId: data.id,
    });

    Order.add(order, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Error adding Order.",
        });
    });

    // transport orders

    let dateFrom = new Date(req.body.date_from);
    const offset = dateFrom.getTimezoneOffset();
    dateFrom = new Date(dateFrom.getTime() - offset * 60 * 1000);
    dateFrom.setDate(dateFrom.getDate() - 1);

    let dateTo = new Date(req.body.date_to);
    dateTo = new Date(dateTo.getTime() - offset * 60 * 1000);
    dateTo.setDate(dateTo.getDate() + 1);
    //date before
    //transport car to pickup salon
    car.date_from = dateFrom;
    car.date_to = dateFrom;
    if (carSalonId !== req.body.pickupSalonId) {
      Car.create(car, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Error adding Car.",
          });

        order = new Order({
          clientId: "",
          workerId: "",
          pickupSalonId: carSalonId,
          returnSalonId: req.body.pickupSalonId,
          statusId: 4,
          carsId: data.id,
        });
        // if pickup salon isn't the same as root salon

        Order.add(order, (err, data) => {
          if (err)
            res.status(500).send({
              message: err.message || "Error adding Order.",
            });
        });
        console.log("Pickup transport added.");
      });
    } else {
      console.log(
        "Pickup transport not needed. Car will be picked up at the same salon where car is located."
      );
    }

    //date after
    car.date_from = dateTo;
    car.date_to = dateTo;

    if (req.body.returnSalonId !== carSalonId) {
      Car.create(car, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Error adding Car.",
          });

        order = new Order({
          clientId: "",
          workerId: "",
          pickupSalonId: req.body.returnSalonId,
          returnSalonId: req.body.carSalonId,
          statusId: 4,
          carsId: data.id,
        });
        Order.add(order, (err, data) => {
          if (err)
            res.status(500).send({
              message: err.message || "Error adding Order.",
            });
        });

        console.log("Return transport added.");
      });
    } else {
      console.log(
        "Return transport not needed. Car will be returned to the same salon by client."
      );
      return;
    }
  });
  res.send("Order created. Not all transports were needed.");
};

exports.findClientOrders = (req, res) => {
  Order.getByClientId(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders.",
      });
    else res.send(data);
  });
};

exports.update = function (req, res) {
  Order.updateById(req.params.id, new Order(req.body), (err, data) => {
    if (err) {
      if (err.error === "Order not found") {
        res.status(404).send({
          message: `Not found Order with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Order with id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.updateStatus = function (req, res) {
  Order.updateStatus(req.params.id, req.params.statusId, (err, data) => {
    if (err) {
      if (err.error === "Order not found") {
        res.status(404).send({
          message: `Not found Order with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Order with id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Order.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Order not found") {
        res.status(404).send({
          message: `Not found Order with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Order with id: " + req.params.id,
        });
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

  const order = new Order({
    clientId: req.body.clientId,
    workerId: req.body.workerId,
    returnSalonId: req.body.returnSalonId,
    statusId: req.body.statusId,
    carsId: req.body.carsId,
  });

  Order.add(order, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error adding Order.",
      });
    else res.send(data);
  });
};

exports.delete = function (req, res) {
  Order.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.error === "Order not found") {
        res.status(404).send({
          message: `Not found Order with id: ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Order with id: " + req.params.id,
        });
      }
    } else res.send({ message: `Order deleted successfully!` });
  });
};
