const router = require("express").Router();
const verify = require("./verify");

router.get("/", verify, (req, res) => {
  res.json({ content: { title: "content ", warn: "Content for logged user" } });
});

module.exports = router;
