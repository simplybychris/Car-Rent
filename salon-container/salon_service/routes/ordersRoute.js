const express = require("express"),
  router = express.Router(),
  orderController = require("../controllers/orderController.js");

// get all orders
router.get("/", orderController.findAll);

router.get("/transportOrders/:id", orderController.transportOrders);

// add reservation
router.post("/addReservation", orderController.addReservation);

// get client orders
router.get("/user/:id", orderController.findClientOrders);

// get order by id
router.get("/:id", orderController.findOne);

// update order
router.put("/:id", orderController.update);

// create new order
router.post("/", orderController.create);

// update order status
router.post("/:id/status/:statusId", orderController.updateStatus);

// delete order by id
router.delete("/:id", orderController.delete);

module.exports = router;
