import { User } from '../models/UserModel.js';
import { StatusCodes } from "http-status-codes";

export const getCurrentUser = async (req, res) => {
    const user = await User.findById(req?.user?.userId);

    res.status(StatusCodes.OK).json(user);
}

export const getCurrentUserDetails = async (req, res) => {
    const user = await User.findById(req.user.userId);

    res.status(StatusCodes.OK).json(user);
}

export const updateUser = async (req, res) => {
    const newUser = { ...req.body };
    delete newUser.password;

    // console.log(req.user.userId, newUser)
    if(req.user.userId !== newUser._id){
        return res.status(401).json({message: "Please login to your account."})
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

    res.status(StatusCodes.OK).json({ data: updatedUser, message: 'user updated' });
}

export const getApplicationStatus = async (req, res) => {
    const users = await User.countDocuments();

    res.status(StatusCodes.OK).json({ users });
}
