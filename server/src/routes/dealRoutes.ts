import express from 'express';
// pulling these in from the controller — might rename later if this file grows
import { getDeals, claimDeal } from '../controllers/dealController';
import { verifyToken } from '../middleware/auth';

const router = express.Router(); // standard express router, nothing fancy here

// GET /api/deals
// Public endpoint — figured there's no harm letting anyone browse deals
router.get('/', getDeals);

// POST /api/deals/claim/:id
// This one *does* need auth since users are actually claiming something
// NOTE: verifyToken has bitten me before when order was wrong, so leaving it explicit here
router.post('/claim/:id', verifyToken, claimDeal);

// exporting as default since that's what the rest of the routes are doing
// (even though named exports might be cleaner… revisit later)
export default router;

/*
  TODO (maybe):
  - add rate limiting here if claims start getting spammy
  - log failed claim attempts for debugging
*/