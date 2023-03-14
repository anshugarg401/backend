const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const JWT_SECRET = "jwtsecret";
router.post(
  "/createuser",
  body("name", "enter a valid name").isLength({ min: 5 }),
  body("email", "enter a valid email").isEmail(),
  body("password", "password must be atleast 5 character").isLength({ min: 5 }),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check if a same email alredy exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,errors: "sorry a user with this email already exist " });
      }
      var salt = await bcrypt.genSaltSync(10);
      var hash = await bcrypt.hashSync(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });


      const data = {
        user: {
          id: user.id,
        },
      };
      
      const authdata = jwt.sign(data, JWT_SECRET);
      console.log(authdata);
      //   .then(user => res.json(user))
      //   .catch(err => {console.log(err)
      let success = true;
      res.json({success,user});
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success,"internal server error");
    }
  }
);

// authenticate user without login first

router.post(
  "/login",

  body("email", "enter a valid email").isEmail(),
  body("password", "password must be atleast 5 character").exists(),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success,errors: "write correct credencials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res.status(400).json({success, errors: "write correct credencials" });
      }

      const data = {
        user: {
          id: user._id,
        },
      };
      const authdata = jwt.sign(data, JWT_SECRET);
      let success = true;
      res.json({success,authdata});
      console.log(authdata);
      //   .then(user => res.json(user))
      //   .catch(err => {console.log(err)
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success,"internal server error");
    }
  }
);

// get logged in user details login required
router.get(
    "/getuser",
    fetchuser,
    async (req, res) => {
        try {
            const userid = req.user.id;
            const user = await User.findById(userid);
           
            res.send(user);
        } catch (error) {
            
        }});

module.exports = router;
