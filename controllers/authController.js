import { Token, User } from '../models/UserModel.js';
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { BadRequestError, NotFoundError, UnAuthenticateError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";
import 'dotenv/config';

import Cryptr from 'cryptr';
import { sendVerificationCodeEmail } from "../utils/emailUtils.js";
import { nanoid } from "nanoid";

const cryptr = new Cryptr(process.env.CRYPTR_KEY);


export const register = async (req, res) => {
    try {
        const {username, email} = req.body;

        const isFirstAccount = (await User.countDocuments()) === 0;
        req.body.role = isFirstAccount ? 'admin' : 'user';

        req.body.password = await hashPassword(req.body.password);
        // req.body.username = username ?? req.body.email;

        // set default username if not provided
        if (!username) {
            const prefix = email.split("@")[0]
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

            req.body.username = `${prefix}_${nanoid(6)}`;
        }

        await User.create(req.body);

        await _sendVerificationEmail(req.body.email);

        return res.status(StatusCodes.OK).json({message: `Verification code sent to ${email}`});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
        throw new UnAuthenticateError('Invalid credentials!');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
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
        expires: new Date(Date.now() + 1000 * 86400 * 7), // 7 day
        sameSite: 'none',
        secure: true,
        ...(process.env.NODE_ENV === 'production' && {domain: '.ezduonline.com'})
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
        ...(process.env.NODE_ENV === 'production' && {domain: '.ezduonline.com'})
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
};


// Region - Email

export const sendVerificationCode = async (req, res) => {
    const {email} = req.params;

    const user = await User.findOne({email});
    if (!user) {
        res.status(404)
        throw new NotFoundError('User not found');
    }

    // console.log(user)
    let userToken = await Token.findOne({userId: user._id, expiresAt: {$gt: Date.now()}})
    if (!userToken) {
        await Token.deleteMany({userId: user._id});

        const loginCode = Math.floor(1000 + Math.random() * 9000);
        const encryptedLoginCode = cryptr.encrypt(loginCode.toString())
        console.log(loginCode)

        userToken = await new Token({
            userId: user._id,
            lToken: encryptedLoginCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * (60 * 1000) // 10 minutes
        }).save();
    }

    const loginCode = userToken.lToken;
    const decryptedLoginCode = cryptr.decrypt(loginCode)

    const emailData = {
        subject: `Verification code - ${process.env.ORG_NAME}`,
        sendTo: email,
        sendFrom: process.env.SMTP_EMAIL_USER,
        replyTo: process.env.SMTP_EMAIL_NOREPLY,
        template: 'loginCode',
        name: user.name,
        verificationCode: decryptedLoginCode,
        logoUrl: process.env.SMTP_LOGO_URL,
    };

    try {
        await sendVerificationCodeEmail(emailData);

        return res.status(StatusCodes.OK).json({message: `Verification code sent to ${email}`});
    } catch (error) {
        res.status(500)
        // console.log(error)
        throw new Error('Email not sent, please try again');
    }


}


export const verificationByCode = async (req, res) => {
    const {email} = req.params;
    const {code} = req.body;

    const user = await User.findOne({email});
    if (!user) {
        res.status(404)
        throw new NotFoundError('User not found');
    }

    if (user.isVerified) {
        return res.status(StatusCodes.OK).json({message: 'User already verified'});
    }

    const userToken = await Token.findOne({userId: user._id, expiresAt: {$gt: Date.now()}})
    if (!userToken) {
        res.status(404)
        throw new BadRequestError('Invalid or Expire token, please send code again');
    }

    const decryptedLoginCode = cryptr.decrypt(userToken.lToken);

    if (code !== decryptedLoginCode) {
        res.status(404)
        throw new BadRequestError('Incorrect code, please try again');
    }else{
        user.isVerified = true
        await user.save()

        const token = createJWT({userId: user._id, role: user.role});

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400 * 7), // 7 day
            sameSite: 'none',
            secure: true,
            ...(process.env.NODE_ENV === 'production' && {domain: '.ezduonline.com'})
        })

        return res.status(StatusCodes.OK).json({message: 'Verification success'});
    }

}



// End Region - Email

const _sendVerificationEmail = async(email)=>{
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    let userToken = await Token.findOne({userId: user._id, expiresAt: {$gt: Date.now()}})
    if (!userToken) {
        await Token.deleteMany({userId: user._id});

        const loginCode = Math.floor(1000 + Math.random() * 9000);
        const encryptedLoginCode = cryptr.encrypt(loginCode.toString())
        console.log(loginCode)

        userToken = await new Token({
            userId: user._id,
            lToken: encryptedLoginCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * (60 * 1000) // 10 minutes
        }).save();
    }

    const loginCode = userToken.lToken;
    const decryptedLoginCode = cryptr.decrypt(loginCode)

    const emailData = {
        subject: `Verification code - ${process.env.ORG_NAME}`,
        sendTo: email,
        sendFrom: process.env.SMTP_EMAIL_USER,
        replyTo: process.env.SMTP_EMAIL_NOREPLY,
        template: 'loginCode',
        name: user.name,
        verificationCode: decryptedLoginCode,
        logoUrl: process.env.SMTP_LOGO_URL,
    };

    try {
        await sendVerificationCodeEmail(emailData);

    } catch (error) {
        // return res.status(500)
        console.log(error)
        throw new Error('Email not sent, please try again');
    }


}