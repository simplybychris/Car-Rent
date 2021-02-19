const User = require("../model/User");
const Worker = require("../model/Worker");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const base64 = require("base64url");

router.get("/", async (req, res) => {
  User.findAll()
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

// router.get("/:id", async (req, res) => {
//   User.findById(req.params.id)
//     .then((docs) => {
//       res.json(docs);
//     })
//     .catch((err) => {
//       console.error(err);
//       return reject(err);
//     });
// });

router.delete("/:id", async (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

router.put("/:id", async (req, res) => {
  User.findByIdAndUpdate(req.params.id, { email: req.body.email })
    .then((docs) => {
      res.json({ message: "User successfully updated" });
    })
    .catch((err) => {
      console.error(err);
      return reject(err);
    });
});

//Validation
const { registerValidation, loginValidation } = require("../validation");
const { restart } = require("nodemon");

// REGISTER /user/register
router.post("/register", async (req, res) => {
  //Validate the data before adding new user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user is already in db
  const emailExist = await User.findOne({ email: req.body.email });
  const peselExist = await User.findOne({ email: req.body.pesel });
  if (emailExist || peselExist) {
    return res.status(400).send("This email or pesel was already used.");
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Create new user`
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashPassword,
    address: req.body.address,
    PESEL: req.body.pesel,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/roles", async (req, res) => {
  const providedToken = req.cookies.token;
  if (providedToken == undefined) {
    res.status(404).send("Not logged in. No token provided.");
    return;
  }
  const jwtParts = providedToken.split(".");
  const payloadInBase64UrlFormat = jwtParts[1];

  const decodedPayload = JSON.parse(base64.decode(payloadInBase64UrlFormat));

  if (decodedPayload != undefined) {
    if (decodedPayload.salonId == null) {
      res.json({
        id: decodedPayload.id,
        email: decodedPayload.email,
        role: "user",
      });
      return decodedPayload.role;
    } else {
      if (decodedPayload.salonId != 0) {
        res.json({
          id: decodedPayload.id,
          email: decodedPayload.email,
          role: "worker",
        });
        return decodedPayload.role;
      } else {
        res.json({
          id: decodedPayload.id,
          email: decodedPayload.email,
          role: "user",
        });
        return decodedPayload.role;
      }
    }
  } else {
    res.status(404).send("Not logged in. Invalid token.");
    return;
  }
});

// LOGIN /user/login

router.post("/login", async (req, res) => {
  console.log("logowanie!");
  // Validate data before user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    //Create and assign a token
    return res.status(400).send("Email or password is wrong");
  }

  console.log("user: ", user);

  // Check password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  // Check if user is worker
  let worker = null;
  worker = await Worker.findOne({ UserId: user._id });
  if (worker != null) {
    console.log("=======Logged as worker=======");
  } else {
    console.log("=======Logged as user=======");
  }

  let salonId = null;

  if (worker != null) {
    if (worker.SalonId != null) {
      salonId = worker.SalonId;
    } else {
      salonId = 0;
    }
  }

  const payload = {
    userId: user._id,
    salonId: salonId,
  };

  if (worker != null) {
    if (payload.salonId != 0) {
      console.log("Salon Worker, SalonId = ", payload.salonId);
    } else {
      console.log("Driver, SalonId = ", payload.salonId);
    }
  }

  const token = jwt.sign(payload, process.env.TOKEN, {
    expiresIn: 1200,
  }); //20 minutes token
  res.cookie("token", token, { httpOnly: true });
  const providedToken = token;
  // req.cookies.token;

  const jwtParts = providedToken.split(".");
  const payloadInBase64UrlFormat = jwtParts[1];

  const decodedPayload = JSON.parse(base64.decode(payloadInBase64UrlFormat));

  let role = null;
  if (decodedPayload.salonId == null) {
    role = "user";
  } else {
    if (decodedPayload.salonId != 0) {
      role = "worker";
    } else {
      role = "driver";
    }
  }
  res.json({ id: user.id, email: user.email, role: role });
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, overwrite: true, maxAge: 1 });
  res.status(200).send("OK");
});

module.exports = router;
