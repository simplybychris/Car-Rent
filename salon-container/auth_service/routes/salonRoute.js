const Salon = require("../model/Salon");
const router = require("express").Router();

router.get("/", async (req, res) => {
  Salon.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.get("/:id", async (req, res) => {
  Salon.findById(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.delete("/:id", async (req, res) => {
  Salon.findByIdAndDelete(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.post('/',async function(req, res){
    let salon = req.body;
    const newSalon = new Salon({
        Name: req.body.Name
      });
      try {
        const savedSalon = await newSalon.save();
        res.send({ salon: savedSalon._id });
      } catch (err) {
        res.status(400).send(err);
      }
});

module.exports = router;
