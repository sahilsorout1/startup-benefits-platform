import { Request, Response } from 'express';
import Deal from '../models/Deal';
import User from '../models/User';

// --------------------
// FETCH ALL DEALS
// --------------------
export const getDeals = async (req: Request, res: Response) => {
  try {
    // Just grabbing the public-facing deal info.
    // Discount codes stay hidden unless explicitly requested.
    const deals = await Deal.find();
    return res.json(deals);

  } catch (err: any) {
    return res.status(500).json({
      message: 'Failed to fetch deals',
      error: err?.message || err
    });
  }
};

// --------------------
// CLAIM A DEAL
// --------------------
export const claimDeal = async (req: Request, res: Response) => {
  try {
    // Auth middleware injects `user` at runtime
    // Casting req once keeps TS quiet without global type hacks
    const reqAny = req as any;
    const authUser = reqAny.user;

    if (!authUser || !authUser.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = authUser.id;
    const dealId = req.params.id;

    const user = await User.findById(userId);
    const deal = await Deal.findById(dealId).select('+discountCode');

    if (!user || !deal) {
      return res.status(404).json({ message: 'Deal or User not found' });
    }

    // --- BUSINESS RULE ---
    // Locked deals require verification
    if (deal.accessLevel === 'locked' && !user.isVerified) {
      return res.status(403).json({
        message: 'This deal is reserved for verified founders. Please complete verification.'
      });
    }

    // Prevent double-claiming
    const alreadyClaimed = user.claimedDeals.some((claimedId: any) => {
      return claimedId.toString() === deal._id.toString();
    });

    if (alreadyClaimed) {
      return res.status(400).json({
        message: 'You have already claimed this deal.',
        code: deal.discountCode // resend in case they lost it
      });
    }

    // Save claim
    user.claimedDeals.push(deal._id as any);
    await user.save();

    // Return the secret code
    return res.json({
      success: true,
      message: 'Deal claimed successfully!',
      discountCode: deal.discountCode
    });

  } catch (err: any) {
    return res.status(500).json({
      message: 'Error claiming deal',
      error: err?.message || err
    });
  }
};