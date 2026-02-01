import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Acts as a basic gatekeeper for protected routes.
// Nothing fancy here, just making sure requests are authenticated.
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    // Expecting: "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        // Client didn’t even try to send a token
        return res.status(401).json({
            message: 'Access denied: no auth token found.'
        });
    }

    // Secret key for JWT verification
    // Fallback is mostly for local dev — should be removed later
    const jwtSecret = process.env.JWT_SECRET || 'secret123';

    try {
        // Split on space instead of overthinking it
        const parts = authHeader.split(' ');
        const token = parts[1]; // parts[0] should be "Bearer"

        if (!token) {
            return res.status(401).json({
                message: 'Access denied: token format is invalid.'
            });
        }

        // Verify token + decode payload
        const decodedUser = jwt.verify(token, jwtSecret);

        // Attach user to request for downstream handlers
        // TS doesn't like this, but runtime-wise it's fine
        // @ts-ignore
        req.user = decodedUser;

        // Let the request continue
        next();

    } catch (error) {
        // Covers expired tokens, bad signatures, etc.
        // Keeping response generic on purpose
        return res.status(400).json({
            message: 'Invalid or expired token.'
        });
    }
};