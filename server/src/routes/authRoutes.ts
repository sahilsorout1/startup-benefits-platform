import express from 'express';
// auth stuff lives here — might split this later if it grows too much
import { register, login } from '../controllers/authController';

const authRouter = express.Router(); // naming it explicitly helps when debugging logs

// Creating a new user account
// Endpoint: POST /api/auth/register
authRouter.post('/register', register);

// User login
// Endpoint: POST /api/auth/login
authRouter.post('/login', login);

// Thought about adding middleware here (rate limiting maybe?)
// leaving it out for now
export default authRouter;