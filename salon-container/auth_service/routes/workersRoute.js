const Worker = require("../model/Worker");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  Worker.findAll()
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.get("/:id", async (req, res) => {
  Worker.findById(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.delete("/:id", async (req, res) => {
  Worker.findByIdAndDelete(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.put("/:id", async (req, res) => {
  Worker.findByIdAndUpdate(req.params.id, { UserId: req.body.UserId })
    .then((docs) => {
      res.json({ message: "Worker successfully updated" });
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.post("/", async function (req, res) {
  const newWorker = new Worker({
    UserId: req.body.UserId,
    SalonId: req.body.SalonId,
  });
  try {
    const savedWorker = await newWorker.save();
    res.send({ user: savedWorker._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
