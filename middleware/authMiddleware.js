import { UnAuthenticateError, UnAuthorizedError } from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {


    const {token} = req.cookies;
    if(!token) {
        throw new UnAuthenticateError('You need to login to access this route');
    }
    // console.log('token: ', token)

    try {
        const {userId, role} = verifyJWT(token);

        req.user = {userId, role};

        console.log('Authenticating user...');
        next();
    } catch(e) {
        console.error('Unauthorized');
        throw new UnAuthenticateError('You need to login to access this route');
    }
}

// export const authenticateAdmin = (req, res, next) => {
//     console.log('Authenticating admin...');
//
//     const {token} = req.cookies;
//     if (!token) {
//         throw new UnAuthenticateError('You need to login to access this route');
//     }
//
//     try {
//         const {userId, role} = verifyJWT(token);
//
//         if (role !== 'admin') {
//             throw new UnAuthenticateError('You need to login as admin to access this route');
//         }
//
//         req.user = {userId, role};
//
//         next();
//     } catch (e) {
//         throw new UnAuthenticateError('You need to login to access this route');
//     }
// }

export const authorizePermission = (...roles) => {
    return (req, res, next) => {
        // console.log('Authorizing permission... ', roles);

        const {token} = req.cookies;
        if(!token) {
            throw new UnAuthenticateError('You need to login to access this route');
        }

        try {
            const {userId, role} = verifyJWT(token);

            if(!roles.includes(role)) {
                throw new UnAuthorizedError('You do not have permission to access this route');
            }

            req.user = {userId, role};

            next();
        } catch(e) {
            throw new UnAuthorizedError('You do not have permission to access this route');
        }
    }
}