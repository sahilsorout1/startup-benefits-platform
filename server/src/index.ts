import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes (keeping imports grouped — I forget them otherwise)
import authRoutes from './routes/authRoutes';
import dealRoutes from './routes/dealRoutes';

// Load env early (burned myself once by putting this too late)
dotenv.config();

const app = express(); // main app instance

// --------------------
// Middleware
// --------------------

// Wide-open CORS for now.
// Lock this down once frontend domains are final.
app.use(cors());

// Built-in body parser (no body-parser needed anymore)
app.use(express.json());

// --------------------
// Routes
// --------------------

app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);

// Health check
// I usually hit this in the browser just to confirm things didn’t explode
app.get('/', (req: Request, res: Response) => {
    res.send('Startup Benefits Platform API is Running...');
});

// --------------------
// Config
// --------------------

const PORT = process.env.PORT || 5000;

// Local fallback is fine for dev — prod should always use env
const MONGO_URI: string =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startup_platform';

// --------------------
// Database Connection
// --------------------

// Using promises here — async/await would be fine too,
// but this is readable enough and easy to debug.
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');

        // Start server only after DB connects
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ DB Connection Error:', err);

        // Not killing the process helps during local dev
        // process.exit(1);
    });

// TODO: graceful shutdown (SIGTERM / SIGINT)
// Not urgent, but future-me will appreciate it