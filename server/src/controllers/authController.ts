import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// --------------------
// USER REGISTRATION
// --------------------
export const register = async (req: Request, res: Response) => {
  try {
    // pulling stuff off the body directly — validation can come later
    const { name, email, password, role } = req.body;

    // Quick sanity check: do we already have this email?
    const userAlreadyThere = await User.findOne({ email });
    if (userAlreadyThere) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Hashing password
    // 10 rounds is usually a good balance
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, generatedSalt);

    // Build user object
    // isVerified defaults to false in schema
    const userData = new User({
      name,
      email,
      password: encryptedPassword,
      role: role ? role : 'founder' // fallback role
    });

    await userData.save();

    // Not logging user in automatically on purpose
    return res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (err: any) {
    // TODO: wire this into a proper logger later
    return res.status(500).json({
      message: 'Server error during registration',
      error: err.message || err
    });
  }
};

// --------------------
// USER LOGIN
// --------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret123'; // dev fallback

    const authToken = jwt.sign(
      { id: foundUser._id, role: foundUser.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    return res.json({
      token: authToken,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        isVerified: foundUser.isVerified
      }
    });

  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error during login',
      error: err.message || err
    });
  }
};