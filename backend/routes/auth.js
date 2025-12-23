const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// =====================
// ENV SAFETY CHECK
// =====================
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ EMAIL_USER or EMAIL_PASS not set in environment');
}

// =====================
// Nodemailer Config (Render-safe)
// =====================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // IMPORTANT for cloud hosting
  },
});

// =====================
// Allowed Email Domains
// =====================
const isAuthorizedEmail = (email) => {
  const allowedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'bmsce.ac.in',
  ];

  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

// =====================
// SIGNUP
// =====================
router.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').optional().isIn(['customer', 'admin']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    if (!isAuthorizedEmail(email)) {
      return res
        .status(400)
        .json({ msg: 'Please use a valid authorized email ID' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ msg: 'User already exists' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'customer',
        isVerified: false,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      await user.save();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      });

      res.json({
        msg: 'Signup successful. OTP sent to email.',
        email,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// =====================
// RESEND OTP
// =====================
router.post(
  '/resend-otp',
  [check('email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
      if (user.isVerified)
        return res.status(400).json({ msg: 'User already verified' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Resend OTP',
        text: `Your new OTP is ${otp}. It expires in 10 minutes.`,
      });

      res.json({ msg: 'OTP resent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// =====================
// VERIFY OTP
// =====================
router.post(
  '/verify-otp',
  [
    check('email').isEmail(),
    check('otp').isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
      if (user.isVerified)
        return res.status(400).json({ msg: 'Already verified' });

      if (user.otp !== otp)
        return res.status(400).json({ msg: 'Invalid OTP' });

      if (Date.now() > user.otpExpiry)
        return res.status(400).json({ msg: 'OTP expired' });

      user.isVerified = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      const payload = {
        user: { id: user.id, role: user.role },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// =====================
// LOGIN
// =====================
router.post(
  '/login',
  [check('email').isEmail(), check('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
      if (!user.isVerified)
        return res.status(400).json({ msg: 'Email not verified' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = {
        user: { id: user.id, role: user.role },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
