const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");
const e = require("express");

const router = express.Router();

// ── Helper: generate JWT ─────────────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ── Helper: format  user for response ────────────────────────────────────────
function fomatUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    plan: user.plan,
    preferredLanguage: user.preferredLanguage,
  };
}

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
    body("fullName").notEmpty().withMessage("Full name is required."),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: errors.array(),
        });
      }

      const { email, password, fullName, phone } = req.body;

      // Check if user email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create a new user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          fullName,
          phone: phone || null,
        },
      });

      // Generate JWT token
      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: "Account created successfully. Welcome to TaxiPoa!",
        data: {
          token,
          user: fomatUser(user),
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message:
          "An error occurred while creating your account. Please try again .",
      });
    }
  },
);

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.json({
        success: true,
        message: "Logged in successfully. Welcome back to TaxiPoa!",
        data: {
          token,
          user: fomatUser(user),
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while logging in. Please try again.",
      });
    }
  },
);

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
    res.json({
    success: true,
    data: { user: req.user }
    });
});

//  ── PATCH /api/auth/me ─────────────────────────────────────────────────────
router.patch('/me', authMiddleware, [
    body('fullName').optional().notEmpty().withMessage('Full name cannot be empty.'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number.'),
    body('preferredLanguage').optional().isIn(['en', 'sw']).withMessage('Preferred language must be either "en" or "sw".'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: errors.array(),
            });
        }

        const { fullName, phone, preferredLanguage, KraPin } = req.body;

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(fullName && { fullName }),
                ...(phone && { phone }),
                ...(preferredLanguage && { preferredLanguage }),
                ...(KraPin && { KraPin }),
            },
        });

        res.json({
            success: true,
            message: 'Profile updated successfully.',
            data: { user: fomatUser(updated) },
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating your profile. Please try again.',
        });
    }
});

module.exports = router;

