const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pass = 10;
const tokenKey = "RANDOM_TOKEN_SECRET";

exports.tokenKey = tokenKey;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, pass)
    .then((hash) => {
      const user = new User({
        login: req.body.login,
        password: hash
      });
      user
        .save()
        .then(res.status(201).json({ message: "ustilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "utilisateur non trouvé" });
      }
      bcrypt
        .compare()
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "password incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, tokenKey, {
              expiresIn: "24h"
            })
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
