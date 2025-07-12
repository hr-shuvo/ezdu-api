import { User } from '../models/UserModel.js';
import { StatusCodes } from "http-status-codes";

// belongs to authController.js
export const getCurrentUser = async (req, res) => {
    const user = await User.findById(req?.user?.userId);

    res.status(StatusCodes.OK).json(user);
}

export const getUserByUsername = async (req, res) => {
    const username = req.params.username || req.params.email;

    const user = await User.findOne({ $or: [{ username }, { email: username }] });

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    res.status(StatusCodes.OK).json(user);
}

// belongs to userController.js - authorized user can get their own details
export const getCurrentUserDetails = async (req, res) => {
    const user = await User.findById(req.user.userId);

    res.status(StatusCodes.OK).json(user);
}

export const updateUser = async (req, res) => {
    // const newUser = { ...req.body };
    // delete newUser.password;
    //
    // // console.log(req.user.userId, newUser)
    // if(req.user.userId !== newUser._id){
    //     return res.status(401).json({message: "Please login to your account."})
    // }
    //
    // const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
    //
    // res.status(StatusCodes.OK).json({ data: updatedUser, message: 'user updated' });

    const userIdFromToken = req.user.userId;
    const updates = req.body;

    const disallowedFields = ['password', '_id', 'email'];

    for (let key of Object.keys(updates)) {
        if (disallowedFields.includes(key)) {
            return res.status(400).json({ message: `You cannot update: ${key}` });
        }
    }

    if (!userIdFromToken) {
        return res.status(401).json({ message: "Unauthorized request." });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userIdFromToken,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully.", user: updatedUser });
}

export const getApplicationStatus = async (req, res) => {
    const users = await User.countDocuments();

    res.status(StatusCodes.OK).json({ users });
}
