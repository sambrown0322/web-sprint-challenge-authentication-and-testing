const router = require("express").Router();
const Users = require("./auth-helpers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  // implement registration
  const userInfo = req.body;

  const isValid = Users.validate(userInfo);

  if (isValid) {
    const hash = bcrypt.hashSync(userInfo.password, 4);
    userInfo.password = hash;
    Users.add(userInfo)
      .then(([user]) => {
        res.status(201).json({ username: user.username, userId: user.id });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: "Invalid info" });
  }
});

router.post("/login", (req, res) => {
  // implement login
  const creds = req.body;

  const isValid = Users.validate(creds);

  if (isValid) {
    Users.findBy({ username: creds.username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          const token = makeJwt(user);
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "Can't access" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: "Invalid info" });
  }
});

function makeJwt(user) {
  const payload = {
    username: user.username,
    subject: user.id,
  };
  const config = {
    jwtSecret: process.env.JWT_SECRET || "Secret",
  };
  const options = {
    expiresIn: "8 hours",
  };
  return jwt.sign(payload, config.jwtSecret, options);
}
module.exports = router;
