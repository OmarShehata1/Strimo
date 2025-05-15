import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getMyFriends,
    getRecommendedUsers,
    sendFriendRequest,
    acceptFriendRequest, 
    getFriendRequests,
    getOutgoingFriendRequests,
    // rejectFriendRequest,
    }
    from '../controllers/usr.controller.js';
const router = express.Router();

// apply middleware to all routes
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
// router.put('/friend-request/:id/reject', rejectFriendRequest);
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);
export default router;