import User from '../models/UserModel.js';
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnAuthenticateError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";


export const register = async (req, res) => {
    try {
        const {username} = req.body;

        const isFirstAccount = (await User.countDocuments()) === 0;
        req.body.role = isFirstAccount ? 'admin' : 'user';

        req.body.password = await hashPassword(req.body.password);
        req.body.username = username ?? req.body.email;        

        await User.create(req.body);

        return res.status(StatusCodes.CREATED).json({message: 'Registration complete'});
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw new UnAuthenticateError('Invalid credentials!');
    }

    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        throw new UnAuthenticateError('Invalid credentials!');
    }

    const token = createJWT({userId: user._id, role: user.role});

    const oneDay = 24 * 60 * 60 * 1000;
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + (oneDay * 7)),
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    // });
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: 'none',
        secure: true,
        ...(process.env.NODE_ENV === 'production' && { domain: '.ezduonline.com' })
    })

    return res.status(StatusCodes.OK).json({message: 'User logged in'});
};

export const logout = async (req, res) => {
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        // expires: new Date(0),
        maxAge: 0,
        sameSite: 'none',
        secure: true,
        ...(process.env.NODE_ENV === 'production' && { domain: '.ezduonline.com' })
    });

    // res.clearCookie('token', 'logout', {
    //     httpOnly: true,
    //     expires: new Date(Date.now()),
    //     // secure: process.env.NODE_ENV === 'production',
    //     secure: true,
    //     // sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    //     sameSite: 'None',
    // });

    return res.status(StatusCodes.OK).json({message: 'User logged out'});
}