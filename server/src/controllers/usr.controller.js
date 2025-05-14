import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedUsers = await User.find({
      $and: [
        {
          _id: { $ne: currentUserId }, // Exclude current user
          _id: { $nin: currentUser.friends },
        }, // Exclude friends of current user
        { isOnboarding: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error(
      "Error fetching recommended users in { getRecommendedUsers }:",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const UserId = req.user.id;
    const currentUser = await User.findById(UserId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(currentUser.friends);
  } catch (error) {
    console.error("Error fetching friends in { getMyFriends }:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const { id: recipientId } = req.params;
    const myId = req.user.id;

    if (recipientId === myId) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if the user is already a friend
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in send Friend request: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    // verify the current user
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "you are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to other friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in accept Frined Request controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
}

// export async function rejectFriendRequest(req, res) {
//   try {
//     const { id: requestId } = req.params;
//     const friendRequest = await FriendRequest.findById(requestId);
//     if (!friendRequest) {
//       return res.status(404).json({ message: "Friend request not found!" });
//     }
//     // verify the current user
//     if (friendRequest.recipient.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "you are not authorized to reject this request" });
//     }
//     // delete the friend request
//     await FriendRequest.findByIdAndDelete(requestId);
//     res.status(200).json({ message: "Friend request rejected" });
//   } catch (error) {
//     console.log("Error in reject Frined Request controller", error.message);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// }


export async function getFriendRequests(req, res) {
  try {
    const userId = req.user.id;

    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    })
    .populate("sender", "fullName profilePic nativeLanguage learningLanguage")
    
    const acceptedReqs = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate(
      "recipient",
      "fullName profilePic "
    );

    res.status(200).json(incomingReqs, acceptedReqs);
  } catch (error) {
    console.error("Error in getPending friend requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const userId = req.user.id;

    const outgoingReqs = await FriendRequest.find({
      sender: userId,
      status: "pending",
    })
    .populate("recipient", "fullName profilePic nativeLanguage learningLanguage")
 
    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.error("Error in getOutgoing friend requests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}