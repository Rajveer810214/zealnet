const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nodemailer = require('nodemailer');
const addFriend = require('../models/addFriend')
const randomstring = require('randomstring');
const cors = require('cors');
router.use(cors());
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
router.use(express.json());

const storedOTPs = {};

router.post('/signup',
  body('name', "name should have minimum length of 5").isLength({ min: 5 }),
  body('password', 'password should have minimum length of 5').isLength({ min: 5 }),
  body('email').isEmail(),
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const validateUser = await User.findOne({ email: req.body.email });
    if (validateUser) {
      return res.status(400).json({ success, message: "User with this email already exists" });
    }

    const myPlaintextPassword = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      isVerified: false,
    });
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "OTP Verification",
      text: `Thanks for sign up on ZealNet. Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send("Failed to send OTP.");
      } else {
        console.log("Email sent: " + info.response);
        storedOTPs[req.body.email] = otp; // Store the OTP in memory
        res.status(200).send("OTP sent successfully.");
      }
    });
    success = true;

    // const authToken = jwt.sign(data, process.env.JWT_SECRET);

    res.status(200).json({ success, user });
  }
);

router.post('/login', [
  body('email').isEmail()
], async (req, res) => {
  let success = true;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    success = false;
    return res.status(400).json({ success, message: "Please try to login with the correct credentials" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (passwordCompare) {
    if (user.isVerified) {
      const data = {
        user: {
          id: user.id
        }
      }
      success = true;
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      return res.status(200).json({ success, authToken });
    } else {
      // Delete the user's details from MongoDB if not verified
      await User.deleteOne({ email });
      success = false;
      return res.status(400).json({ success, message: "User not verified. Account deleted." });
    }
  } else {
    success = false;
    return res.status(400).json({ success, message: "Please try to login with the correct credentials" });
  }
});


// Password reset route using POST request
// Password update route using PUT request
router.put('/updatepassword', [
  body('email').isEmail(),
  body('newPassword', 'password should have a minimum length of 5').isLength({ min: 5 }),
], async (req, res) => {
  let success = true;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    success = false;
    return res.status(400).json({ failure, message: "User with this email does not exist" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  user.password = hash;

  const otp = randomstring.generate({ length: 6, charset: 'numeric' });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "For Reset the password",
    text: `Your OTP is: ${otp}. You can enter this opt of the forgotpassword page and enter your newpassword.Your password will be changed`,
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send OTP.");
    } else {
      console.log("Email sent: " + info.response);
      storedOTPs[req.body.email] = otp; // Store the OTP in memory
      res.status(200).send("OTP sent successfully.");
      user.isVerified = false;
      await user.save();
    }
  });
  const data = {
    user: {
      id: user.id
    }
  }
  success = true;
});

router.post('/getuser', fetchuser, async (req, res) => {
  let success = true;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    console.log(user)

    res.status(200).json({ success, user });

  } catch (error) {
    success = false;
    res.status(400).json(success, "Internal server error occured");

  }

})
// Assuming you have the necessary imports and setup for your Express server

// Define the new API endpoint to get all users
router.get('/getallusers', async (req, res) => {
  let success = true;
  try {
    // Fetch all users from the database and exclude the password field
    const users = await User.find().select("-password");

    // Send the users array as a response
    res.status(200).json({ success, users });
  } catch (error) {
    success = false;
    res.status(500).json({ success, error: "Internal server error occurred" });
  }
});
router.get('/getallfriends', fetchuser, async (req, res) => {
  let success = true;
  try {
    // Fetch the logged-in user by their ID
    const addfriend = await addFriend.find({ user: req.user.id })

    // Check if the user exists
   

    // Send the friends array as a response
    res.status(200).json({ success, addfriend });
  } catch (error) {
    success = false;
    res.status(500).json({ success, error: 'Internal server error occurred' });
  }
});

router.post('/addfriend',fetchuser, async(req, res) => {
  let success=true;
  try {
    console.log(req.body.name,req.body.email)
  const addfriend = await addFriend.create({
    name: req.body.name,
    email: req.body.email,
    user:req.user.id
  });
  success=true;
  await addfriend.save()
  // Send a response back to the frontend
  res.status(200).json({ success: `Successfully added  as a friend` });
} catch (error) {
  success=false;
  console.log(error)
  res.status(400).json({ success, error: "Internal server error occurred" });

}
});

router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  const storedOTP = storedOTPs[email];
  if (!user) {
    success = false;
    return res.status(400).json({ success, message: "User with this email does not exist" });
  }
  if (storedOTP === otp) {
    // OTP is correct

    user.isVerified = true; // Update the verification status
    await user.save();

    const data = {
      user: {
        id: user.id
      }
    }
    // Generate the auth token and send it back to the client
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, authToken });
  } else {
    // OTP is incorrect
    res.status(400).send("Invalid OTP.");
  }
});



module.exports = router;