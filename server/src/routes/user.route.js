import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMyFriends, getRecommendedUsers , sendFriendRequest , acceptFriendRequest } from '../controllers/usr.controller.js';
const router = express.Router();

// apply middleware to all routes
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.get('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);



export default router;